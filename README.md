# left-merge

```js
let result = leftMerge(left, right);
```

Recursively compare two object, merge `right` into `left`, but maintain the structure of `left`, ignoring redundent properties from `right`. Inspired by "left join" of SQL.

One good use case could be updating user settings when you change the structure of default settings. One place it may happen is in localStorage of production sites.

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

### Example use case with user settings:

```js
// user's settings, maybe stored in localStorage or back end:
const userSettings = {
  language: 'French',
  itemsPerPage: 50,
};
// default settings of the app, and the structure recently evolved:
const defaultSettings = {
  language: 'Enligsh',
  useDarkMode: false,
};
// on app start, update user settings with:
let updatedUserSettings = leftMerge(defaultSettings, userSettings); /* ->
{
  language: 'French',
  useDarkMode: false,
} */
```

### Immutability:

Arguments and their nested children are never mutated, but may be shallow copied when no change is needed.

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
