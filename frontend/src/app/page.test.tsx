import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import Home from "./page";

test("home page renders a heading", () => {
  const html = renderToStaticMarkup(<Home />);
  expect(html).toContain("<h1");
});
