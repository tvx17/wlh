
export function createID(projectId = -1) {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  let id = ''
  for (let i = 0; i < 3; i++) {
    id += letters[Math.floor(Math.random() * letters.length)]
  }
  for (let i = 0; i < 3; i++) {
    id += numbers[Math.floor(Math.random() * numbers.length)]
  }

  return id + (projectId !== -1 ? '_' + projectId : '')
}

export function dtValues(created = true, updated = true, deleted = false) {
  const retunValues = {}
  if (created) {
    retunValues['createdAt'] = new Date().toISOString()
  }
  if (updated) {
    retunValues['updatedAt'] = new Date().toISOString()
  }
  if (deleted) {
    retunValues['deletedAt'] = new Date().toISOString()
  }
  return retunValues
}

export function dtValue() {
    return new Date().toISOString()
}


export default {
  createID, dtValues, dtValue
}
