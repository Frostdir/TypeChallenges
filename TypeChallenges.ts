// Implement the Absolute type. A type that take string, number or bigint. The output should be a positive number string
//
// For example
//
// type Test = -100;
// type Result = Absolute<Test>; // expected to be "100"

type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer N}`
    ? N
    : `${T}`;

//------------------------------------------------------------------------------------------------------------------------------


// Implement Python liked any function in the type system. A type takes the Array and returns true if any element of the Array is true. If the Array is empty, return false.
//
//     For example:
//
//     type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
// type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.

type Falsy = 0 | "" | false | [] | { [P in any]: never };

type AnyOf<T extends readonly any[]> = T extends [infer H, ...infer T]
    ? H extends Falsy
        ? AnyOf<T>
        : true
    : false;

//------------------------------------------------------------------------------------------------------------------------------


// For given function type Fn, and any type A (any in this context means we don't restrict the type, and I don't have in mind any type 😉) create a generic type which will take Fn as the first argument, A as the second, and will produce function type G which will be the same as Fn but with appended argument A as a last one.
//
//     For example,
//
//     type Fn = (a: number, b: string) => number
//
// type Result = AppendArgument<Fn, boolean>
// // expected be (a: number, b: string, x: boolean) => number

type AppendArgument<Fn, A> = Fn extends (...args: [...infer P]) => infer R
    ? (...args: [...P, A]) => R
    : never;

//------------------------------------------------------------------------------------------------------------------------------


// Implement Capitalize<T> which converts the first letter of a string to uppercase and leave the rest as-is.
//
//     For example
//
// type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'

interface CapitalizedChars {
    f: "F";
}
type Capitalizes<S> = S extends `${infer C}${infer T}`
    ? `${C extends keyof CapitalizedChars ? CapitalizedChars[C] : C}${T}`
    : S;

//------------------------------------------------------------------------------------------------------------------------------


// Get an Object that is the difference between O & O1

type Diff<O, O1> = {
    [P in keyof O | keyof O1 as Exclude<P, keyof O & keyof O1>]: P extends keyof O
        ? O[P]
        : P extends keyof O1
            ? O1[P]
            : never;
};

//------------------------------------------------------------------------------------------------------------------------------


// Merge two types into a new type. Keys of the second type overrides keys of the first type.
//
//     For example
//
// type foo = {
//     name: string;
//     age: string;
// }
// type coo = {
//     age: number;
//     sex: string
// }
//
// type Result = Merge<foo,coo>; // expected to be {name: string, age: number, sex: string}

type Merge<F, S> = {
    [P in keyof F | keyof S]: P extends keyof S
        ? S[P]
        : P extends keyof F
            ? F[P]
            : never;
};


//------------------------------------------------------------------------------------------------------------------------------

// Implement the generic Mutable<T> which makes all properties in T mutable (not readonly).
//
// For example
//
// interface Todo {
//     readonly title: string
//     readonly description: string
//     readonly completed: boolean
// }
//
// type MutableTodo = Mutable<Todo>

type Mutable<T> = { -readonly [P in keyof T]: T[P] };


//------------------------------------------------------------------------------------------------------------------------------

// Implement the built-in Omit<T, K> generic without using it.
//
//     Constructs a type by picking all properties from T and then removing K
//
// For example
//
// interface Todo {
//     title: string
//     description: string
//     completed: boolean
// }
//
// type TodoPreview = MyOmit<Todo, 'description' | 'title'>
//
// const todo: TodoPreview = {
//     completed: false,
// }

type MyOmit<T, K> = { [P in keyof T as P extends K ? never : P]: T[P] };

//------------------------------------------------------------------------------------------------------------------------------

// From T, pick a set of properties whose type are assignable to U.
//
//     For Example
//
// type OnlyBoolean = PickByType<{
//     name: string
//     count: number
//     isReadonly: boolean
//     isEnable: boolean
// }, boolean> // { isReadonly: boolean; isEnable: boolean; }

type PickByType<T, U> = { [P in keyof T as T[P] extends U ? P : never]: T[P] };

//------------------------------------------------------------------------------------------------------------------------------

// Type the function PromiseAll that accepts an array of PromiseLike objects, the returning value should be Promise<T> where T is the resolved result array.
//
//     const promise1 = Promise.resolve(3);
// const promise2 = 42;
// const promise3 = new Promise<string>((resolve, reject) => {
//     setTimeout(resolve, 100, 'foo');
// });
//
// // expected to be `Promise<[number, 42, string]>`
// const p = PromiseAll([promise1, promise2, promise3] as const)

declare function PromiseAll<T extends unknown[]>(
    values: readonly [...T]
): Promise<{ [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P] }>;

//------------------------------------------------------------------------------------------------------------------------------

// Implement TrimLeft<T> which takes an exact string type and returns a new string with the whitespace beginning removed.
//
//     For example
//
// type trimed = TrimLeft<'  Hello World  '> // expected to be 'Hello World

type TrimLeft<S> = S extends `${" " | "\n" | "\t"}${infer T}` ? TrimLeft<T> : S;

//------------------------------------------------------------------------------------------------------------------------------

// Implement a generic TupleToUnion<T> which covers the values of a tuple to its values union.
//
//     For example
//
// type Arr = ['1', '2', '3']
//
// type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'

type TupleToUnion<T extends unknown[]> = T[number];

//------------------------------------------------------------------------------------------------------------------------------

// In this challenge, we would like to get the corresponding type by searching for the common type field in the union Cat | Dog. In other words, we will expect to get Dog for LookUp<Dog | Cat, 'dog'> and Cat for LookUp<Dog | Cat, 'cat'> in the following example.
//
//     interface Cat {
//     type: 'cat'
//     breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
// }
//
// interface Dog {
//     type: 'dog'
//     breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
//     color: 'brown' | 'white' | 'black'
// }
//
// type MyDogType = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`

type LookUp<U, T> = U extends { type: T } ? U : never;

//------------------------------------------------------------------------------------------------------------------------------

// Implement permutation type that transforms union types into the array that includes permutations of unions.
// type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']

type Permutation<T, C = T> = [T] extends [never]
    ? []
    : C extends infer U
        ? [U, ...Permutation<Exclude<T, U>>]
        : [];

//------------------------------------------------------------------------------------------------------------------------------

// Implement a generic Pop<T> that takes an Array T and returns an Array without it's last element.
//
// For example
//
// type arr1 = ['a', 'b', 'c', 'd']
// type arr2 = [3, 2, 1]
//
// type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
// type re2 = Pop<arr2> // expected to be [3, 2]
// Extra: Similarly, can you implement Shift, Push and Unshift as well?

type Pop<T extends any[]> = T extends [...infer H, infer T] ? H : never;

//------------------------------------------------------------------------------------------------------------------------------
