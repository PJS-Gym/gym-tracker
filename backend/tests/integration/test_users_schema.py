import unittest
from uuid import uuid4

import psycopg

from app.core.config import settings


class UsersSchemaTest(unittest.TestCase):
    def test_required_fields_default_timestamp_and_unique_clerk_id(self):
        clerk_id = f"user_test_{uuid4().hex}"
        with psycopg.connect(settings.DATABASE_URL) as conn:
            try:
                row = conn.execute(
                    "INSERT INTO users (clerk_id, email) VALUES (%s, %s) "
                    "RETURNING clerk_id, email, created_at",
                    (clerk_id, "test@example.com"),
                ).fetchone()
                self.assertEqual(row[:2], (clerk_id, "test@example.com"))
                self.assertIsNotNone(row[2].tzinfo)
                with self.assertRaises(psycopg.errors.UniqueViolation):
                    with conn.transaction():
                        conn.execute(
                            "INSERT INTO users (clerk_id, email) VALUES (%s, %s)",
                            (clerk_id, "other@example.com"),
                        )
                for column in ("clerk_id", "email", "created_at"):
                    with self.assertRaises(psycopg.errors.NotNullViolation):
                        with conn.transaction():
                            conn.execute(
                                f"INSERT INTO users (clerk_id, email, created_at) "
                                f"VALUES (%s, %s, CURRENT_TIMESTAMP) "
                                f"ON CONFLICT (clerk_id) DO UPDATE SET {column} = NULL",
                                (clerk_id, "test@example.com"),
                            )
            finally:
                conn.rollback()
