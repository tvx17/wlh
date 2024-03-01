export function createIID(pId = -1) {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  let id = ''
  for (let i = 0; i < 3; i++) {
    id += letters[Math.floor(Math.random() * letters.length)]
  }
  for (let i = 0; i < 3; i++) {
    id += numbers[Math.floor(Math.random() * numbers.length)]
  }

  return id + (pId !== -1 ? '_' + pId : '')
}

export default {
  createIID
}
