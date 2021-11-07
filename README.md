# left-merge

```js
const result = leftMerge(left, right);
```

Recursively compare two object, merge `right` into `left`, but maintain the structure of `left`, ignoring redundant fields from `right`. Inspired by "left join" in SQL.

### install:

```
npm i left-merge
```

### when can it be useful:

Imagine `left` is the default preference settings of your app, and `right` is the user's customized settings, which is stored on the client side. But the two have different shapes because the user hasn't logged on for a long time. You don't know what shape or what old version he has, but you want to update him to the latest version, meanwhile preserve his custom settings.

### example:

```js
import { leftMerge } from 'left-merge';
// user's existing preferences:
const userPreferences = {
  language: 'French',
  itemsPerPage: 50,
};
// now you evolved the default settings into a new structure:
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

### another example:

```js
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

### Immutability:

Both arguments and their nested children are never mutated, but may be shallow copied when no change is needed.

### null and undefined:

If a field is `null` or `undefined` on the left, it'll be overwritten by the counterpart on the right. If `null` or `undefined` is on the right, it won't overwrite left.

(when these happen, you'll see more detailed reports in the verbose loggings in development)

### type conflicts:

Except `null` and `undefind`, when a field has different types on left and right, right will be ignored.

(when this happens, you'll see more detailed reports in the verbose loggings in development)

### if you're using commonjs `require`:

```js
const { leftMerge } = require('left-merge');
```
