# Weekly report snapshot format

A weekly report is a frozen copy of one user's results for one week, Monday to Sunday in `Europe/Warsaw`. It is written once to `reports.snapshot` (`jsonb`). Later changes to workouts, exercises or measurements never change it, so names and numbers are copied in rather than referenced.

This format is the contract between the tickets that write it (#19) and read it (#20, #21, #23). Numbers follow the rules in #6. Two complete examples are in `backend/app/seed/demo_reports/`.

## The `reports` row

These fields live in columns next to the snapshot. `opened_at` changes after the report is issued, so it cannot be part of a frozen document.

| Column | Type | Meaning |
|---|---|---|
| `week_start` | date | Monday of the reported week. One report per user and week. |
| `status` | text | `pending`, `ready` or `failed`. A `ready` report always has `snapshot` and `issued_at`. |
| `issued_at` | timestamp | When the report was issued (the issue date shown to the user). |
| `opened_at` | timestamp or null | When the user first opened it. Null means not opened yet. |

## Conventions

- Weights and tonnage are in kg, body circumferences in cm. Numbers are JSON numbers, rounded to 2 decimal places. Percentages are rounded to 1.
- Effective sets can be fractional (a secondary muscle group counts 0.5).
- Every section has a `text` field: the finished sentence from the template, in Polish. Clients display it as is.
- Muscle groups are identified by the `key` from `muscle_groups`, with `name_pl` copied in.

### Change

Every comparison is a `Change` object, or null when there is nothing to compare.

| Field | Type | Meaning |
|---|---|---|
| `status` | text | `percent`, or `new` when the earlier value is 0 and the current one is not ("nowość"). |
| `percent` | number or null | Signed change, e.g. `-13.3`. Null when `status` is `new`. |

A `Change` is null when both values are 0, when a comparison has no earlier data, or for the 4-week average on accounts younger than 4 weeks.

## Top level

| Field | Type | Meaning |
|---|---|---|
| `schema_version` | number | Format version, currently `1`. Raise it on any breaking change. |
| `meta` | object | See below. |
| `summary` | object | Always present. |
| `muscle_map` | object | Always present. |
| `strength` | object | Always present. |
| `records` | object | Always present, `items` may be empty. |
| `body` | object or null | Null when the reported week has no body measurement. |
| `neglected` | object | Always present, `groups` may be empty. |

## `meta`

| Field | Type | Meaning |
|---|---|---|
| `week_start` | date | Monday of the reported week. |
| `week_end` | date | Sunday of the reported week. |
| `display_name` | text or null | Name or nickname for the public page, as it was when the report was issued. |

## `summary`

| Field | Type | Meaning |
|---|---|---|
| `text` | text | Template sentence. |
| `workouts` | number | Workouts in the week. |
| `active_days` | number | Distinct days with a workout. |
| `effective_sets` | number | Sum of `effective_sets` over all muscle groups. |
| `tonnage_kg` | number | Reps × kg over all sets, each set counted once. |
| `vs_previous_week` | object | `workouts`, `active_days`, `effective_sets` and `tonnage_kg`, each a `Change`. |

## `muscle_map`

| Field | Type | Meaning |
|---|---|---|
| `text` | text | Template sentence. |
| `groups` | array | Exactly 17 items, one per muscle group, including those with 0 sets. |
| `groups[].key`, `groups[].name_pl` | text | The muscle group. |
| `groups[].effective_sets` | number | Effective sets in the week. |
| `groups[].tonnage_kg` | number | Tonnage credited to this group. |
| `groups[].vs_previous_week` | object | `effective_sets` and `tonnage_kg`, each a `Change`. |
| `groups[].vs_4_week_average` | object | The same two fields against the average of the 4 previous weeks. |
| `top_groups` | array of text | Up to 3 keys with the most effective sets, most first. Tonnage breaks ties. |

## `strength`

| Field | Type | Meaning |
|---|---|---|
| `text` | text | Template sentence. |
| `exercises` | array | Exercises from the week that have a best e1RM, highest first. |
| `exercises[].name` | text | Exercise name. |
| `exercises[].best_e1rm_kg` | number | Best e1RM in the week. |
| `exercises[].vs_previous_4_weeks` | `Change` | Against the best e1RM of the 4 previous weeks. |
| `improved_groups` | array | Muscle groups where strength went up, largest increase first. |
| `improved_groups[].key`, `.name_pl` | text | The muscle group. |
| `improved_groups[].exercise_name` | text | The exercise with the largest increase in this group. |
| `improved_groups[].percent` | number | That increase. |
| `improved_groups[].text` | text | Template sentence for this group. |

## `records`

| Field | Type | Meaning |
|---|---|---|
| `text` | text | Template sentence. |
| `items` | array | Personal records broken this week. An exercise can appear once per `type`. |
| `items[].exercise_name` | text | Exercise name. |
| `items[].type` | text | `e1rm` or `max_weight`. |
| `items[].value_kg` | number | The new record. |
| `items[].previous_kg` | number | The record before this week. |

## `body`

| Field | Type | Meaning |
|---|---|---|
| `text` | text | Template sentence. |
| `mass_kg`, `chest_cm`, `hips_cm` | object or null | Null when this week's newest measurement left that value empty. |
| `*.current` | number | Value from the newest measurement in the week. |
| `*.previous` | number or null | Value from the newest measurement before the week. Null when there is none. |
| `*.change` | number or null | `current` minus `previous`. |
| `relative_strength` | array | Up to 3 exercises with the best e1RM in the week. |
| `relative_strength[].exercise_name` | text | Exercise name. |
| `relative_strength[].best_e1rm_kg` | number | Best e1RM in the week. |
| `relative_strength[].mass_kg` | number | Newest body mass at the end of the week. |
| `relative_strength[].ratio` | number | `best_e1rm_kg` / `mass_kg`, rounded to 2 places. |

## `neglected`

| Field | Type | Meaning |
|---|---|---|
| `text` | text | Template sentence. |
| `groups` | array | Muscle groups with 0 effective sets in this and the previous week. |
| `groups[].key`, `groups[].name_pl` | text | The muscle group. |
