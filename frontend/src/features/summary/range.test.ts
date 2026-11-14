import { describe, expect, test } from "bun:test";
import { parseRange, rangeHref } from "./range";

describe("parseRange", () => {
  test("this week by default and for anything unknown", () => {
    expect(parseRange({}).kind).toBe("this_week");
    expect(parseRange({ zakres: "rok" }).kind).toBe("this_week");
  });

  test("named ranges", () => {
    expect(parseRange({ zakres: "poprzedni-tydzien" }).kind).toBe("last_week");
    expect(parseRange({ zakres: "4-tygodnie" }).kind).toBe("last_4_weeks");
  });

  test("custom dates", () => {
    expect(parseRange({ zakres: "wlasny", od: "2026-11-01", do: "2026-11-13" })).toEqual({
      kind: "custom",
      slug: "wlasny",
      from: "2026-11-01",
      to: "2026-11-13",
    });
  });

  test("an end before the start, or missing dates, is not a range yet", () => {
    expect(parseRange({ zakres: "wlasny", od: "2026-11-13", do: "2026-11-01" }).kind).toBe("custom-incomplete");
    expect(parseRange({ zakres: "wlasny", od: "2026-11-13" }).kind).toBe("custom-incomplete");
    expect(parseRange({ zakres: "wlasny", od: "13.11.2026", do: "2026-11-14" }).kind).toBe("custom-incomplete");
  });
});

test("rangeHref keeps dates only for custom ranges", () => {
  expect(rangeHref("poprzedni-tydzien", "2026-11-01")).toBe("/podsumowanie?zakres=poprzedni-tydzien");
  expect(rangeHref("wlasny", "2026-11-01", "2026-11-13")).toBe("/podsumowanie?zakres=wlasny&od=2026-11-01&do=2026-11-13");
});
