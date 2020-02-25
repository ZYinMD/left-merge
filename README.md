# left-merge

```js
let result = leftMerge(left, right); // returns a new object
```

Recursively compare two object, merge `right` into `left`, but maitain the structure of `left`, ignoring redundent properties from `right`. Inspired by "left join" of SQL.

One good use case is dealing with production site localStorage.

### examples:

```js
import leftMerge from 'left-merge';
const template = {
  species: 'cat',
  color: ['yellow', 'black'],
  stats: { speed: 10 },
};
const modification = {
  species: 'tiger',
  stats: { speed: 25, canFly: true },
};

const result = leftMerge(template, modification); /* ->
{
  species: 'tiger',
  color: ['yellow', 'black'],
  stats: { speed: 25},
} */
```

### Example use case with production site localStorage:

```js
import leftMerge from 'left-merge';
const userLocalStorage = {
  language: 'French',
  itemsPerPage: 50,
};
const defaultSettingsV2 = {
  language: 'Enligsh',
  useDarkMode: false,
};
const newUserSettings = leftMerge(defaultSettingsV2, userLocalStorage); /* ->
{
  language: 'French',
  useDarkMode: false,
} */
```

### Immutability:

Returns a new object, arguments and their nested properties are never mutated, plain-object-like properties are not shallow copied, but non-object-like properties are shallow copied (Array, Date, Set, Map, etc).
