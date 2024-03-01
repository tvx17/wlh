import common from './common';

const _table = 'books';

export async function readOneById(id:number): Promise<any>{
  return await common.readOneById(_table, id);
}
export function readOne() {
  //---
}
export function readAll() {
  //---
}
export function read() {
  //---
}
export function update() {
  //---
}
export function create() {
  //---
}
export function deleteOneById() {
  //---
}
export function deleteAll() {
  //---
}


export default {
  readOneById, readOne, readAll, read};
