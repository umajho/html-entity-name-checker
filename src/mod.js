import { Checker } from "./checker.js";
import { HTML_ENTITY_TRIE_STRICT } from "./data.js";

/**
 * @returns { Checker }
 */
export function createStrictHTMLEntityNameChecker() {
  return new Checker(HTML_ENTITY_TRIE_STRICT);
}
