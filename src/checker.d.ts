import { TrieNode } from "./trie";

declare type CheckerState =
  | [type: 1, /* expecting char on trie */ node: TrieNode | null]
  | [
    type: 2, /* reading part of string */
    reading: string,
    nextIndexToRead: number,
    nextNode: TrieNode | null,
  ]
  | [type: 3 /* illegal */];
