// import {Account} from "../model/account";
//
// // https://stackoverflow.com/questions/60872063/enforce-typescript-object-has-exactly-one-key-from-a-set
// // type OneKey<K extends string, V = any> = {
// //     [P in K]: (Record<P, V> &
// //         Partial<Record<Exclude<K, P>, never>>) extends infer O
// //         ? { [Q in keyof O]: O[Q] }
// //         : never
// // }[K];
// // https://stackoverflow.com/questions/44425344/typescript-interface-with-xor-barstring-xor-cannumber
// type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
// type Xor<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
//
// // export type Condition = XOR<OneKey<'EQ' | 'NE' | 'LT' | 'LTE' | 'GT' | 'GTE'>, OneKey<'IN' | 'NIN', any[]>>
//
//
// type V = string | number;
//
// type Eq = { EQ: any }
// type Ne = { NE: V }
// type Lt = { LT: V }
// type Lte = { LTE: V }
// type Gt = { GT: V }
// type Gte = { GTE: V }
// type In = { IN: V[] }
// type Nin = { NIN: V[] }
// type Exists = { EXISTS: boolean }
// type Regex = {REG: string}
// // type Not = { NOT: Comparison}
// type Comparison = Xor<Eq, Xor<Ne, Xor<Lt, Xor<Lte, Xor<Gt, Xor<Gte, Xor<In, Xor<Nin, Xor<Exists, Regex>>>>>>>>>
//
// export type Condition<T> = {
//     [key in keyof T]?: Comparison
// }
//
// type And<T> = { AND: (Condition<T> | Logical<T>)[] };
// type Or<T> = { OR: (Condition<T> | Logical<T>)[] };
// export type Logical<T> = Xor<And<T>, Or<T>>;
//
// export type Expression<T> = Xor<Logical<T>, Condition<T>>
//
// const c: Expression<Account> = {
//     OR: [
//         {
//             AND: [
//                 {username: {LT: 1}},
//                 {username: {GT: 1}}
//             ]
//         },
//         {
//             AND: [
//                 {email: {LT: 1}},
//                 {email: {GT: 1}}
//             ]
//         }
//     ]
// };
