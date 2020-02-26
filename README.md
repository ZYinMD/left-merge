# left-merge

```js
let result = leftMerge(left, right);
```

Recursively compare two object, merge `right` into `left`, but maitain the structure of `left`, ignoring redundent properties from `right`. Inspired by "left join" of SQL.

One good use case could be updating localStorage in production sites.

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

### if you're using commonjs `require`:

```js
const leftMerge = require('left-merge').default;
```

### Immutability:

Objects and their nested children are never mutated, but may be shallow copied when no change is needed.

### `null` and `undefined`:

If a field is `null` or `undefined` on the left, it'll be overwritten by the counterpart on the right. If `null` or `undefined` is on the right, it won't have any effect.

The logs of this library will tell you more details when it happens.

### type conflicts of left and right:

Except for `null` and `undefind`, when a field is of different types on left and right, right will be discarded. The logs of this library will tell you more details when it happens.
