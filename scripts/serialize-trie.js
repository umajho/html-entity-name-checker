#!/usr/bin/env node

import fs from "fs";
import process from "process";

const leaf = Symbol("leaf");

function main() {
  const names = fs.readFileSync(0, "utf-8").split("\n");
  const trie = buildTrieFromWords(names);
  const output = serializeTrie(trie /*, "\n"*/);
  const stringsToBeReplaced = pickStringsToBeReplacedAsReferences(output)
    .slice(0, 62)
    // to ensure that longer strings are replaced first, so substring won't
    // break longer strings.
    .sort((a, b) => b.length - a.length);
  const shortenedOutput = //
    replaceStringsWithReferences(output, stringsToBeReplaced);
  process.stdout.write(stringsToBeReplaced.join(" ") + "\n" + shortenedOutput);
}

/**
 * Turns names into a trie。
 *
 * @param { string[] } names
 * @returns { any }
 */
function buildTrieFromWords(names) {
  const trie = {};
  for (const name of names) {
    let node = trie;
    for (const [i, char] of [...name].entries()) {
      const isLast = i === name.length - 1;
      if (!node[char]) {
        node[char] = isLast ? leaf : {};
      } else if (node[char] === leaf) {
        if (isLast) throw new Error("duplicated?");
        node[char] = { [leaf]: true };
      } else if (isLast) {
        node[char][leaf] = true;
      }
      node = node[char];
    }
  }
  return trie;
}

/**
 * Serializes a trie.
 *
 * All Words in the input trie should conform the RegExp `/^[a-z\d]+$/i`. This
 * function doesn't check about that.
 *
 * @param { any } node
 * @param { string } sep the separator between items
 * @returns
 */
function serializeTrie(node, sep = ",") {
  let outputs = [];
  for (const [char, childNode] of Object.entries(node)) {
    let output = "";
    output += char;
    if (childNode !== leaf) {
      if (childNode[leaf]) {
        if (Object.entries(childNode).length === 0) {
          throw new Error("unreachable");
        }
        output += `{;${serializeTrie(childNode)}}`;
      } else {
        if (Object.entries(childNode).length === 1) {
          output += serializeTrie(childNode);
        } else {
          output += `{${serializeTrie(childNode)}}`;
        }
      }
    }
    outputs.push(output);
  }
  return outputs.join(sep);
}

/**
 * Picks 62 strings that can be replaced as references for reducing the output
 * size.
 *
 * @param { string } originalOutput
 * @returns { string[] }
 */
function pickStringsToBeReplacedAsReferences(originalOutput) {
  const continuousStrings_ = extractContinuousStrings(originalOutput);
  const continuousStrings = Object.entries(continuousStrings_);
  const stringsWithWeight = calculateWeightsForStrings(continuousStrings);
  const picked = stringsWithWeight
    .sort((a, b) => b[1] - a[1])
    .slice(0, 26 * 2 + 10);
  return picked.map(([str, _]) => str);
}

/**
 * Extracts all strings that satisfies the RegExp `/[a-z\d]{3,}/i` with how many
 * times those strings occur. This function then filters out all strings that
 * occurred only once.
 *
 * @param { string } text
 * @returns { { [string: string]: number } }
 */
function extractContinuousStrings(text) {
  const continuousStrings = {};
  for (const g of [...text.matchAll(/[a-z\d]{3,}/ig)]) {
    const str = g[0];
    if (str.length <= 2) continue;
    if (continuousStrings[str]) {
      continuousStrings[str]++;
    } else {
      continuousStrings[str] = 1;
    }
  }
  for (const [str, count] of Object.entries(continuousStrings)) {
    if (count < 2) {
      delete continuousStrings[str];
    }
  }
  return continuousStrings;
}

/**
 * Calculates the weight of the the input strings basing on the lengths and the
 * occurrences of those strings. The strings with non-positive weights are
 * filtered out.
 *
 * The weight of a string is just how many bytes can be saved if that string is
 * replaced as a reference.
 *
 * @param { [string: string, count: number][] } continuousStrings
 * @returns { [string: string, weight: number][] }
 */
function calculateWeightsForStrings(continuousStrings) {
  return continuousStrings
    .map(([str, count]) => [str, (str.length - 2) * count - str.length])
    .filter(([_, weight]) => weight > 0);
}

/**
 * Replaces strings as references. The input strings cannot be more than 62.
 *
 * @param { string } text
 * @param { string[] } strings
 * @returns { string }
 */
function replaceStringsWithReferences(text, strings) {
  if (strings.length > 62) throw new Error("unreachable");
  for (const [i, str] of strings.entries()) {
    text = text.replaceAll(str, "$" + convertIndexToID(i));
  }

  return text;
}

/**
 * @param { number } i
 * @returns { string }
 */
function convertIndexToID(i) {
  if (i > 62) throw new Error("unreachable");
  if (i < 10) return "" + i;
  return String.fromCharCode(
    i < 36 ? ("A".charCodeAt(0) + i - 10) : ("a".charCodeAt(0) + i - 36),
  );
}

main();
