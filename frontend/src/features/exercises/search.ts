import type { Exercise } from "@/lib/exercises";

/** Lower case without Polish marks, so "lawka" finds "ławka" and "WYCISKANIE" finds "wyciskanie". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replaceAll("ł", "l")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

export type Filters = {
  query: string;
  /** A muscle group key; matches exercises where it is a primary group. */
  muscle: string | null;
  equipment: string | null;
  mine: boolean;
};

export const NO_FILTERS: Filters = { query: "", muscle: null, equipment: null, mine: false };

export const hasFilters = (filters: Filters) =>
  filters.query.trim() !== "" || filters.muscle !== null || filters.equipment !== null || filters.mine;

/**
 * A rough Polish stem: the word without its vowel ending, with the k/c alternation undone, so
 * "ławka", "ławki" and "ławce" all become "lawk" and "sztangą" meets "sztangi".
 */
export function stem(word: string): string {
  const bare = word.replace(/[aeiouy]+$/, "");
  return bare.endsWith("c") && !bare.endsWith("cz") ? `${bare.slice(0, -1)}k` : bare;
}

type Word = { word: string; stem: string };

const wordsCache = new WeakMap<Exercise, Word[]>();
function wordsOf(exercise: Exercise): Word[] {
  let words = wordsCache.get(exercise);
  if (words === undefined) {
    words = normalize(`${exercise.name} ${exercise.name_en}`)
      .split(" ")
      .map((word) => ({ word, stem: stem(word) }));
    wordsCache.set(exercise, words);
  }
  return words;
}

function matchesWord(words: Word[], query: string): boolean {
  const queryStem = stem(query);
  return words.some(
    ({ word, stem: wordStem }) => word.startsWith(query) || (queryStem.length >= 3 && wordStem.startsWith(queryStem)),
  );
}

/**
 * Every word of the query must start a word of the Polish or English name ("wycisk law", "bench"),
 * in any grammatical form ("ławka" finds "na ławce").
 * The filters all apply together.
 */
export function filterExercises(exercises: Exercise[], filters: Filters): Exercise[] {
  const words = normalize(filters.query).split(" ").filter(Boolean);
  const found = exercises.filter(
    (exercise) =>
      (!filters.mine || exercise.own) &&
      (filters.muscle === null || exercise.primary.includes(filters.muscle)) &&
      (filters.equipment === null || exercise.equipment === filters.equipment) &&
      words.every((word) => matchesWord(wordsOf(exercise), word)),
  );
  if (words.length === 0) return found;
  // Names that begin with what was typed come first ("Wyciskanie sztangi…" before "Naprzemienne
  // wyciskanie…"), then the rest in their usual order.
  const rank = (exercise: Exercise) => {
    const polish = normalize(exercise.name);
    if (polish.startsWith(words[0])) return 0;
    if (normalize(exercise.name_en).startsWith(words[0])) return 1;
    return 2;
  };
  return found.map((exercise) => [rank(exercise), exercise] as const).sort((a, b) => a[0] - b[0]).map(([, exercise]) => exercise);
}

/** Filters live in the address, so coming back from an exercise finds the list as it was left. */
export function filtersFromParams(params: Record<string, string | string[] | undefined>): Filters {
  const one = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : null);
  return { query: one("q") ?? "", muscle: one("partia"), equipment: one("sprzet"), mine: one("moje") === "1" };
}
