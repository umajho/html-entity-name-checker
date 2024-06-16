#!/usr/bin/env node

import fs from "fs";
import process from "process";

const input = JSON.stringify(fs.readFileSync(0, "utf-8"));
console.log(`export default ${input};`);
