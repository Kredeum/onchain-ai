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

//  import type { KeysOfUnion } from 'type-fest';
type KeysOfUnion<ObjectType> = ObjectType extends unknown ? keyof ObjectType : never;

const data = {
  0: { a: 1, b: 2 },
  1: { a: 4, c: 5 }
};
type DataKeys = keyof typeof data;
type DataValues = (typeof data)[DataKeys];
type InnerKeys = KeysOfUnion<DataValues>;

const dataArray1 = Object.values(data);
type DataType1 = typeof dataArray1;
type DataUnion1 = {
  [K in keyof DataType1[number]]: DataType1[number][K];
};

const dataArray2 = [
  { a: 1, b: 2 },
  { a: 4, c: 5 }
];
type DataType2 = typeof dataArray2;
type DataUnion2 = {
  [K in keyof DataType2[number]]: DataType2[number][K];
};

const data1: DataUnion1 = dataArray1[0];
console.log("data1:", data1);

const data2: DataUnion2 = dataArray2[0];
console.log("data2:", data2);
