module.exports = leftMerge;
function leftMerge(left: Record<string, any>, right: Record<string, any>, _keyName?: string) {
	if (right === null) {
		warn('right_is_null', _keyName);
		return null;
	}
	if (left === undefined) {
		warn('left_is_undefined', _keyName);
		return { ...right };
	}
	if (left === null) {
		warn('left_is_null', _keyName);
		return null;
	}
	if (right === undefined) {
		warn('right_is_undefined', _keyName);
		return { ...left };
	}
	if (!isPlainObject(left)) warn('not_plain', _keyName);
	const result = { ...left };
	if (getType(left) !== getType(right)) {
		warn('not_same_type', _keyName);
		return result;
	}
	for (const [key, leftValue] of Object.entries(left)) {
		if (!(key in right)) continue;
		const rightValue = right[key];
		if (isObject(leftValue)) {
			result[key] = leftMerge(leftValue, rightValue, key);
			continue;
		}
		if (getType(leftValue) !== getType(rightValue)) {
			if (rightValue === null) {
				warn('right_is_null', key);
			} else if (leftValue === undefined) {
				warn('left_is_undefined', key);
			} else {
				if (rightValue === undefined) warn('right_is_undefined', key);
				else if (leftValue === null) warn('left_is_null', key);
				else warn('not_same_type', key);
				continue;
			}
		}
		result[key] = rightValue;
	}
	return result;
}

function isPlainObject(thing: any) {
	if (!isObject(thing)) return false;
	const prototype = Object.getPrototypeOf(thing);
	return prototype === Object.prototype || prototype === null;
}

function isObject(thing: any): thing is Record<string, any> {
	return getType(thing) === '[object Object]';
}

function getType(thing: any) {
	return Object.prototype.toString.call(thing);
}

type Warnings =
	| 'not_plain'
	| 'not_same_type'
	| 'left_is_null'
	| 'right_is_null'
	| 'left_is_undefined'
	| 'right_is_undefined';

function warn(type: Warnings, keyName?: string) {
	if (process?.env?.NODE_ENV === 'production') return;
	let message = `(This warning won't show in production) leftMerge: `;
	switch (type) {
		case 'not_plain':
			if (keyName) message += `the field "${keyName}"`;
			else message += `your left argument`;
			message += ` isn't a plain object, inherited and innumerable properties will be discarded (this limitation only applys to the left)`;
			break;
		case 'not_same_type':
			if (keyName)
				message += `the field "${keyName}" is of different types on left and right, the value on right is discarded`;
			else message += `Your left and right arguments are of different type. Right is discarded.`;
			break;
		case 'right_is_null':
			if (keyName) message += `the field "${keyName}" is null on right`;
			else message += `Your right argument is null`;
			message +=
				", which will be used to overwrite left. If you don't want to overwrite, use `undefined` on right.";
			break;
		case 'left_is_null':
			if (keyName) message += `the field "${keyName}" is null on left`;
			else message += `Your left argument is null`;
			message +=
				", which will NOT be overwritten by value on right. If it's not what you want, use `undefined` on left.";
			break;
		case 'right_is_undefined':
			if (keyName) message += `the field "${keyName}" on right is \`undefined\``;
			else message += 'Your right argument is `undefined`';
			message += `, which will NOT be used to overwrite left. If you want to overwrite left, use null on right.`;
			break;

		case 'left_is_undefined':
			if (keyName) message += `the field "${keyName}" on left is \`undefined\``;
			else message += 'Your left argument is `undefind`';
			message += `, which will be overwritten by the value on right. If you don't want to overwrite, use null on left.`;
			break;
		default:
	}
	console?.warn(message);
}
