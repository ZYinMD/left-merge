# left-merge

```js
let result = leftMerge(left, right);
```

Recursively compare two object, merge `right` into `left`, but maintain the structure of `left`, ignoring redundent fields from `right`. Inspired by "left join" in SQL.

One good use case could be updating user preferences when you change the structure of default preferences. One place it may happen is in localStorage or IndexedDB of production sites.

### examples:

```js
import { leftMerge } from 'left-merge';
const template = {
  species: 'cat',
  color: ['yellow', 'black'],
  stats: { speed: 10 },
};
const modification = {
  species: 'tiger',
  stats: { speed: 25, canFly: true },
};

let result = leftMerge(template, modification); /* ->
{
  species: 'tiger',
  color: ['yellow', 'black'],
  stats: { speed: 25},
} */
```

### Example use case with stored user preferences:

```js
// user's existing preferences:
const userPreferences = {
  language: 'French',
  itemsPerPage: 50,
};
// now you evolved the default settings into a new strucutre:
const defaultSettings = {
  language: 'Enligsh',
  useDarkMode: false,
};
// on app start, update user preference to the new structure:
let updatedUserPreferences = leftMerge(defaultSettings, userPreferences); /* ->
{
  language: 'French',
  useDarkMode: false,
} */
```

### Immutability:

Both arguments and their nested children are never mutated, but may be shallow copied when no change is needed.

### null and undefined:

If a field is `null` or `undefined` on the left, it'll be overwritten by the counterpart on the right. If `null` or `undefined` is on the right, it won't overwrite left.

(when these happen, you'll see more detailed reports in the verbose loggings in developemnt)

### type conflicts of left and right:

Except for `null` and `undefind`, when a field has different types on left and right, right will be ignored.

(when this happens, you'll see more detailed reports in the verbose loggings in developemnt)

### if you're using commonjs `require`:

```js
const { leftMerge } = require('left-merge');
```
