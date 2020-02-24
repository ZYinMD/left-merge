const leftMerge = require('../dist/index.js');

const template = {
	species: 'cat',
	color: ['yellow', 'black'],
	stats: {
		strength: 5,
		speed: 10,
		aura: {
			sleepy: false,
			excitement: false,
		},
	},
};

it('returns left if right is not the same type', () => {
	const customization = 'foo';
	expect(leftMerge(template, customization)).toEqual(template);
});

it('returns {} if left is {}', () => {
	expect(leftMerge({}, template)).toEqual({});
});

it('overwrites left with right when property matches, and disregards properties not pre existed on left', () => {
	const customization = {
		gender: 'female',
		color: ['orange'],
		stats: {
			speed: 12,
			aura: {
				radiation: true,
				excitement: true,
			},
		},
	};
	expect(leftMerge(template, customization)).toEqual({
		species: 'cat',
		color: ['orange'],
		stats: {
			strength: 5,
			speed: 12,
			aura: {
				sleepy: false,
				excitement: true,
			},
		},
	});
});

it(`discards fields on right if of different type than left`, () => {
	const customization = {
		color: 'yellow',
		stats: {
			strength: 'high',
			aura: ['AC', 'sleepy'],
		},
	};
	expect(leftMerge(template, customization)).toEqual(template);
});

it(`returns right if left is undefined`, () => {
	expect(leftMerge(undefined, template)).toEqual(template);
});

it(`returns left if right is undefined`, () => {
	expect(leftMerge(template, undefined)).toEqual(template);
});

test(`if a field is undefined on right, use left`, () => {
	const customization = {
		species: 'tiger',
		color: undefined,
		stats: {
			strength: undefined,
			aura: undefined,
		},
	};
	expect(leftMerge(template, customization)).toEqual({ ...template, species: 'tiger' });
});

test(`if a field is undefined on left, use right`, () => {
	const left = {
		species: undefined,
		color: undefined,
		stats: {
			strength: undefined,
			aura: undefined,
		},
	};
	expect(leftMerge(left, template)).toEqual({
		species: 'cat',
		color: ['yellow', 'black'],
		stats: {
			strength: 5,
			aura: {
				sleepy: false,
				excitement: false,
			},
		},
	});
});

it(`returns null if right is null`, () => {
	expect(leftMerge(template, null)).toBe(null);
});

test(`if a field is null on right, overwrite left with null`, () => {
	const customization = {
		species: 'tiger',
		color: null,
		stats: {
			speed: null,
			aura: null,
		},
	};
	expect(leftMerge(template, customization)).toEqual({
		species: 'tiger',
		color: null,
		stats: {
			strength: 5,
			speed: null,
			aura: null,
		},
	});
});

test(`if a field is unll on left, don't overwrite`, () => {
	const left = {
		species: null,
		color: null,
		stats: {
			strength: null,
			aura: null,
		},
	};
	expect(leftMerge(left, template)).toEqual(left);
});

test(`if left is null, return null`, () => {
	expect(leftMerge(null, template)).toBe(null);
});

describe('test inherited properties', () => {
	const crookshank = Object.create(template);
	crookshank.color = ['orange'];
	test(`inherited properties on left will be discarded`, () => {
		const customization = {
			species: 'wizard',
		};
		expect(leftMerge(crookshank, customization)).toEqual({
			color: ['orange'],
		});
	});

	test(`same for nested objects`, () => {
		const foo = { foo: crookshank };
		expect(leftMerge(foo, foo)).toEqual({ foo: { color: ['orange'] } });
	});

	test(`inherited properties on right is honored`, () => {
		const template = {
			species: 'unknown',
			color: [''],
		};
		expect(leftMerge(template, crookshank)).toEqual({
			species: 'cat',
			color: ['orange'],
		});
	});
});

describe('test properties from constructor and methods', () => {
	class Cat {
		constructor(name) {
			this.species = 'cat';
			this.name = name;
		}
		get color() {
			return ['orange'];
		}
	}
	const garfield = new Cat('Garfield');
	Object.assign(garfield, { stats: { aura: { sleepy: true } } });
	test(`on left, properties from constructor is honored, but methods are discarded`, () => {
		const customization = { color: ['black', 'yellow'] };
		expect(leftMerge(garfield, customization)).toEqual({
			species: 'cat',
			name: 'Garfield',
			stats: {
				aura: { sleepy: true },
			},
		});
	});
	test(`on right, properties from constructor is honored, methods are also honored, but only when left is undefined`, () => {
		expect(leftMerge(template, garfield)).toEqual({
			species: 'cat',
			color: ['orange'],
			stats: {
				strength: 5,
				speed: 10,
				aura: {
					sleepy: true,
					excitement: false,
				},
			},
		});
	});
});

//TODO:
// a field is not an object (date, set, etc), test both left and right
