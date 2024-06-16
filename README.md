# html-entity-name-checker

```javascript
import { createStrictHTMLEntityNameChecker } from "html-entity-name-checker";

const checker1 = createStrictHTMLEntityNameChecker();
console.log(checker1.expectChar("n")); // => true
console.log(checker1.expectChar("b")); // => true
console.log(checker1.expectChar("s")); // => true
console.log(checker1.expectChar("p")); // => true
console.log(checker1.expectEnd()); // => true
try {
  checker1.expectChar("a");
} catch (e) {
  console.log(e); // => Error
}

const checker2 = createStrictHTMLEntityNameChecker();
console.log(checker2.expectChar("?")); // => false

const checker3 = createStrictHTMLEntityNameChecker();
console.log(checker3.expectEnd()); // => false
```
