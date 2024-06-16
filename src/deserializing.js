import { CAN_END } from "./leaf.js";

const TOKENS = {
  PUSH: Symbol("PUSH"),
  POP: Symbol("POP"),
  SEP: Symbol("SEP"),
  LEAF: Symbol("LEAF"),
};

/**
 * @param { string } input
 * @returns { Trie }
 */
export function deserialize(input) {
  const tokens = tokenize(input);
  return buildTrieFromTokens(tokens);
}

/**
 * @param { (string | (typeof TOKENS)[keyof typeof TOKENS])[] } tokens
 * @returns { TrieNode | null }
 */
function buildTrieFromTokens(tokens) {
  if (!tokens.length) return null;

  /** @type {TrieNode} */
  let currentNode = {};
  const stack = [currentNode];

  let shouldSkipNext = false;
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    if (shouldSkipNext) {
      shouldSkipNext = false;
      continue;
    }
    if (typeof token === "string") {
      if (token.length > 1) {
        currentNode[token[0]] = token;
      }
      if (nextToken === TOKENS.PUSH) {
        /** @type {TrieNode} */
        const deeperNode = {};
        currentNode[token] = deeperNode;
        stack.push(deeperNode);
        currentNode = deeperNode;
        shouldSkipNext = true;
      } else if (nextToken === TOKENS.SEP) {
        currentNode[token] = null;
        shouldSkipNext = true;
      } else if (nextToken === TOKENS.POP || typeof nextToken === "undefined") {
        currentNode[token] = null;
      }
    } else if (token === TOKENS.LEAF) {
      currentNode[CAN_END] = true;
      if (typeof nextToken !== "string") throw new Error("unreachable");
    } else if (token === TOKENS.POP) {
      stack.pop();
      currentNode = stack.at(-1);
      if (nextToken === TOKENS.SEP) {
        shouldSkipNext = true;
      }
    } else {
      throw new Error("unreachable");
    }
  }
  stack.pop();

  if (stack.length !== 1) throw new Error("unreachable");
  return stack[0];
}

/**
 * @param { string } input
 * @returns { (string | (typeof TOKENS)[keyof typeof TOKENS])[] }
 */
function tokenize(input) {
  const [refs_, code] = input.split("\n");
  const refs = refs_.split(" ");

  const tokens = [];
  let shouldSkipNext = false;
  for (let i = 0; i < code.length; i++) {
    let char = code[i];
    if (shouldSkipNext) {
      shouldSkipNext = false;
      continue;
    }
    switch (char) {
      case "{":
        tokens.push(TOKENS.PUSH);
        break;
      case "}":
        tokens.push(TOKENS.POP);
        break;
      case ",":
        tokens.push(TOKENS.SEP);
        break;
      case ";":
        tokens.push(TOKENS.LEAF);
        break;
      case "$":
        shouldSkipNext = true;
        char = dereference(refs, code[i + 1]);
      // fallthrough
      default:
        if (typeof tokens.at(-1) === "string") {
          tokens[tokens.length - 1] = tokens.at(-1) + char;
        } else {
          tokens.push(char);
        }
    }
  }

  return tokens;
}

/**
 * @param { string[] } refs
 * @param { string } id
 * @returns { string }
 */
function dereference(refs, id) {
  let index;
  if (/\d/.test(id)) {
    index = Number(id);
  } else if (/[A-Z]/.test(id)) {
    index = id.charCodeAt(0) - "A".charCodeAt(0) + 10;
  } else {
    index = id.charCodeAt(0) - "a".charCodeAt(0) + 36;
  }
  return refs[index];
}
