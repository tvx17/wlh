import crud from 'src/app/code/crud'
import store from 'src/app/store'

const noProjectIdTables = ['projects', 'users']


export async function create(table: string, data: object) {
  if(!data.hasOwnProperty('projectId')) {
    data['projectId'] = store.projectCurrent.value
  }
  return await crud.create(table, data)
  //---
}

export async function readOneById(table: string,  id: number) {
  return await crud.read(table,{id: id})
  //---
}
export function readOne(table: string) {
  //---
}
export async function readAll(table: string) {
  //---
}
export async function read(table: string, summary=true) {
  const where = {}
  if(!noProjectIdTables.includes(table)) {
    where['projectId'] = store.projectCurrent.value
  }

  return await crud.read(
    table,
    {returnColumns: ['id','summary'], where: where})
  //---
}
export async function update(table: string, data: object, where: object) {

  return await crud.update(table, data, where)
  //---
}
export function updateOneById(table: string){
//---
}
export async function deleteOneById(table: string, id:number, softDelete=true){
  await crud.delete(table, {id: id}, softDelete)
 //---
}
export function deleteAll(table: string){
  //---
}
export function del(table: string){
  //---
}


export default {readOneById, readOne, readAll, read, update, updateOneById, deleteOneById, deleteAll, delete:del, create};
