/* eslint-disable @typescript-eslint/no-unused-vars */
//
// Awfull buggy Typescript... (v5.7.2)
//
// dataArray1 and dataArray2 are the same, but
// type DataUnion1 and DataUnion2 differs
//
// > type DataUnion1 = {
// >   a: number;
// > }
//
// > type DataUnion2 = {
// >     a: number;
// >     b?: number | undefined;
// >     c?: number | undefined;
// > }
//
// data1 = { a: 1, b: 2 } not conformant to DataUnion1
//
// in consequence, no way to simply type json files...

import type { KeysOfUnion } from "type-fest";

// const data = {
//   0: { a: 1, b: 2 },
//   1: { a: 4, c: 5 }
// };

// type DataKeys = keyof typeof data;
// type DataValues = typeof data[DataKeys];
// type InnerKeys = keyof DataValues;

// const dataArray1 = Object.values(data);
// console.log("dataArray1:", dataArray1);

// type DataType1 = typeof dataArray1;
// type DataT = KeysOfUnion<DataType1>
// type DataUnion1 = {
//   [K in keyof DataType1[number]]: DataType1[number][K];
// };

// Your data object
const data = {
  0: { a: 1, b: 2 },
  1: { a: 4, c: 5 }
};

// Get the type of the keys of 'data'
type DataKeys = keyof typeof data;
// DataKeys is '0' | '1'

// Get the type of the values in 'data'
type DataValues = (typeof data)[DataKeys];
// DataValues is { a: number; b: number } | { a: number; c: number }

// Get the keys of the union of inner objects
type InnerKeys = keyof DataValues;
// InnerKeys is 'a' | 'b' | 'c'
