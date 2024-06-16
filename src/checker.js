import { CAN_END } from "./leaf.js";

export class Checker {
  /**
   * @param {TrieNode} trie
   */
  constructor(trie) {
    /**
     * @type { CheckerState }
     */
    this.state = [1, trie];
  }

  /**
   * Checks if the input character can be the next one. If `false` is returned,
   * the instance on which the method is called should not be used anymore.
   *
   * @param { string } char
   * @returns { boolean }
   */
  expectChar(char) {
    if (this.state[0] === 1) {
      const node = this.state[1];
      if (!node || !(char in node)) {
        this.state = [3];
        return false;
      }
      const item = node[char];

      if (typeof item === "string") {
        this.state = [2, item, 1, node[item]];
      } else {
        this.state = [1, item];
      }
      return true;
    } else if (this.state[0] === 2) {
      const [_, reading, nextIndexToRead, nextNode] = this.state;
      if (reading[nextIndexToRead] !== char) {
        this.state = [3];
        return false;
      }
      if (nextIndexToRead + 1 === reading.length) {
        this.state = [1, nextNode];
      } else {
        this.state = [2, reading, nextIndexToRead + 1, nextNode];
      }
      return true;
    } else {
      throw new Error("This instance is not usable anymore");
    }
  }

  /**
   * Checks if the entity name can be ended here. After calling this method,
   * the instance on which this method is called should not be used anymore.
   */
  expectEnd() {
    if (this.state[0] === 1) {
      const node = this.state[1];
      this.state = [3];
      return !node || !!node[CAN_END];
    } else if (this.state[0] === 2) {
      this.state = [3];
      return false;
    } else {
      throw new Error("This instance is not usable anymore");
    }
  }
}
