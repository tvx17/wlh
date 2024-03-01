import books from 'src/app/entities/Books'
import settings from 'src/app/entities/Settings'
import common from 'src/app/entities/common'

export function useEntities() {
  return {
    books, settings, common
  };
}
