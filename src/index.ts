export default leftMerge;
export { leftMerge };

function leftMerge(left: Record<string, any>, right: Record<string, any>, _keyName?: string) {
	if (right === null || right === undefined) {
		warn('right_is_nullish', _keyName);
		return left;
	}
	if (left === null || left === undefined) {
		warn('left_is_nullish', _keyName);
		return right;
	}
	if (getType(left) !== getType(right)) {
		warn('not_same_type', _keyName);
		return left;
	}
	if (!isObject(left)) return right;
	if (!isPlainObject(left)) warn('not_plain', _keyName);

	const result = {} as typeof left;
	for (const key in left) {
		if (key in right) result[key] = leftMerge(left[key], right[key], key);
		else result[key] = left[key];
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

type Warnings = 'not_plain' | 'not_same_type' | 'right_is_nullish' | 'left_is_nullish';

function warn(type: Warnings, keyName?: string) {
	if (process?.env?.NODE_ENV === 'production') return;
	let message = `(This warning won't show in production) leftMerge: `;
	switch (type) {
		case 'not_plain':
			if (keyName) message += `the field "${keyName}"`;
			else message += `your left argument`;
			message += ` isn't a plain object, inherited properties will become plain properties, innumerable properties will be lost`;
			break;
		case 'not_same_type':
			if (keyName)
				message += `the field "${keyName}" is of different types on left and right, the value on right is discarded`;
			else message += `Your left and right arguments are of different type. Right is discarded.`;
			break;
		case 'right_is_nullish':
			if (keyName) message += `the field "${keyName}" on right is \`null\` or \`undefined\``;
			else message += 'Your right argument is `null` or `undefined`';
			message +=
				" , which will NOT be used to overwrite left. If you want to overwrite left, use things like '' or [] or 'unset'.";
			break;
		case 'left_is_nullish':
			if (keyName) message += `the field "${keyName}" on left is \`null\` or \`undefined\``;
			else message += 'Your left argument is `null` or `undefined`';
			message += `, which will be overwritten by the value on right. `;
			break;
		default:
	}
	console?.warn(message);
}
