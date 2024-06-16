import { CAN_END } from "./leaf";

declare interface TrieNode {
  /**
   * If this is true, it means that the word can be ended here.
   */
  [CAN_END]?: true;
  /**
   * When the value is a `TrieNode`, the word continues with the key and then
   * that `TrieNode`; When the key is a single character and the value is a
   * string, the word continues with the value and then a `TrieNode` that is
   * indexed by the value; When the value is null, the word continues with
   * the key and then is ended.
   */
  [string: string]: TrieNode | string | null;
}
