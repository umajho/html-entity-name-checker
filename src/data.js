import HTML_ENTITY_TRIE_STRICT_SERIALIZED from "../generated/html-entity-trie-strict.js";

import { deserialize } from "./deserializing.js";

export const HTML_ENTITY_TRIE_STRICT = //
  deserialize(HTML_ENTITY_TRIE_STRICT_SERIALIZED);
