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

it('overwrites left with right when property matches, and discards properties not pre existed on left', () => {
	const modification = {
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
	expect(leftMerge(template, modification)).toEqual({
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

it(`returns right if left is undefined`, () => {
	expect(leftMerge(undefined, template)).toEqual(template);
	expect(leftMerge(undefined, 'foo')).toBe('foo');
	expect(leftMerge(undefined, false)).toBe(false);
	expect(leftMerge(undefined, {})).toEqual({});
	expect(leftMerge(undefined, new Set())).toEqual(new Set());
});

it(`returns right if left is null`, () => {
	expect(leftMerge(null, template)).toEqual(template);
	expect(leftMerge(null, 'foo')).toBe('foo');
	expect(leftMerge(null, false)).toBe(false);
	expect(leftMerge(null, {})).toEqual({});
	expect(leftMerge(null, new Set())).toEqual(new Set());
});

it(`returns left if right is undefined`, () => {
	expect(leftMerge(template, undefined)).toEqual(template);
	expect(leftMerge('foo', undefined)).toBe('foo');
	expect(leftMerge(false, undefined)).toBe(false);
	expect(leftMerge({}, undefined)).toEqual({});
	expect(leftMerge(new Set(), undefined)).toEqual(new Set());
});

it(`returns left if right is null`, () => {
	expect(leftMerge(template, null)).toEqual(template);
	expect(leftMerge('foo', null)).toBe('foo');
	expect(leftMerge(false, null)).toBe(false);
	expect(leftMerge({}, null)).toEqual({});
	expect(leftMerge(new Set(), null)).toEqual(new Set());
});

it('returns {} if left is {}', () => {
	expect(leftMerge({}, template)).toEqual({});
	expect(leftMerge({}, 'foo')).toEqual({});
	expect(leftMerge({}, false)).toEqual({});
	expect(leftMerge({}, ['1'])).toEqual({});
	expect(leftMerge({}, new Date())).toEqual({});
});

it('returns left if right is not the same type', () => {
	expect(leftMerge(template, 'foo')).toEqual(template);
	expect(leftMerge(template, {})).toEqual(template);
	expect(leftMerge(template, false)).toEqual(template);
	expect(leftMerge(template, ['1'])).toEqual(template);
	expect(leftMerge(template, new Date())).toEqual(template);
});

it(`discards fields on right if of different type than left`, () => {
	const modification = {
		color: 'yellow',
		stats: {
			strength: 'high',
			aura: ['AC', 'sleepy'],
		},
	};
	expect(leftMerge(template, modification)).toEqual(template);
});

test(`if a field is undefined or null on right, use left`, () => {
	const modification = {
		species: null,
		color: undefined,
		stats: {
			strength: null,
			aura: undefined,
		},
	};
	expect(leftMerge(template, modification)).toEqual(template);
});

test(`if a field is '' or [] on right, will overwrite lest, but {} won't`, () => {
	const modification = {
		species: '',
		color: [],
		stats: {
			speed: 0,
			aura: {},
		},
	};
	expect(leftMerge(template, modification)).toEqual({
		species: '',
		color: [],
		stats: {
			strength: 5,
			speed: 0,
			aura: {
				sleepy: false,
				excitement: false,
			},
		},
	});
});

test(`if a field is undefined or null on left, use right`, () => {
	const left = {
		species: 'ghost',
		color: undefined,
		stats: {
			strength: null,
			speed: undefined,
			aura: null,
		},
	};
	expect(leftMerge(left, template)).toEqual(template);
});

describe('test inherited properties', () => {
	const crookshank = Object.create(template);
	crookshank.color = ['orange'];
	test(`inherited properties on left will be discarded`, () => {
		const modification = {
			species: 'wizard',
		};
		expect(leftMerge(crookshank, modification)).toEqual({
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
		const modification = { color: ['black', 'yellow'] };
		expect(leftMerge(garfield, modification)).toEqual({
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

describe(`test non-primitive non-plain objects as properties`, () => {
	const left = {
		1: new Date(54321),
		2: new Set([...'abc']),
		3: {
			1: new Map().set(true, false),
			2: new Map().set(true, false),
			3: new Map().set(true, false),
			4: undefined,
			5: null,
		},
	};
	const right = {
		1: new Date(12345),
		2: new Set([...'xyz']),
		3: {
			1: new Map().set(false, true),
			2: undefined,
			3: null,
			4: new Map().set(false, true),
			5: new Map().set(false, true),
		},
	};
	test(`normally`, () => {
		expect(leftMerge(left, right)).toEqual({
			1: new Date(12345),
			2: new Set([...'xyz']),
			3: {
				1: new Map().set(false, true),
				2: new Map().set(true, false),
				3: new Map().set(true, false),
				4: new Map().set(false, true),
				5: new Map().set(false, true),
			},
		});
	});
	test(`on root`, () => {
		const obj = new Date(54321);
		expect(leftMerge(obj, new Date(12345))).toEqual(new Date(12345));
	});
});
