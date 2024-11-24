# Style Guide

Please setup deno and prettier as described in [SETUP.md](SETUP.md).

All code should be formatted automatically by them.

Files and directories should be named in `camel_case`. Tests should be put next to the files they are testing.

```
└── my_component/
    ├── my_component.tsx
    ├── my_component.test.tsx
    └── another_component/
        ├── another_component.tsx
        └── another_component.test.tsx
```

Components, types, and interfaces should be named in `PascalCase`.

```tsx
interface Animal {
	species: string;
	weight: number;
};

type BinaryOperation = (a: number, b: number) => number;

function MyComponent() {
	return (
		<h1>
			Hello!
		</h1>
	);
}
```

Variables, constants, object properties, and functions should be named in `camelCase`.

```ts
const myConstant = 3;

let myVariable = myNumber*2;

const myObject = {
	thisIsAProperty: 0,
};

function addTwoNumbers(a: number, b: number) {
	return a+b;
}
```

Prefer interfaces over type aliases where possible

```ts
// dont do this
type Animal = {
	species: string;
	weight: number;
};

// do this instead
interface Animal {
	species: string;
	weight: number;
};

// this is fine because you cant use an interface for this
type BinaryOperation = (a: number, b: number) => number;
```

Prefer `const` over `let` where possible.

```ts
function addTwoNumbers(a: number, b: number) {
	// dont do this
	let c = a+b;
	return c;
}

function addTwoNumbers(a: number, b: number) {
	// do this instead
	const c = a+b;
	return c;
}
```

Comments should be used to explain complex code.

```ts
// dont do this
// create a variable named a with the value 3
let a = 3;

// do this
// paragraph only includes words that have an 'a' and a frequency greater than 10
const paragraph = listOfWords
		.filter((word) => word.frequency > 10)
		.map((word) => word.text)
		.filter((text) => text.includes("a"))
		.join(" ");

```
