export const forms = {
  books: {
    minDatasets: 1,
    form: 'books',
    header: 'Books',
    type: 'list',
    table: 'books'
  },
  projects: {
    minDatasets: 1,
    form: 'projects',
    header: 'Projects',
    type: 'list',
    table: 'projects'
  },
  settings: {
    form: 'settings',
    header: 'Settings',
    type: 'single',
    table: 'settings'
  },
  structure: {
    form: 'structure',
    header: 'Structure',
    type: 'tree',
    table: 'structure'
  },
  users: {
    minDatasets: 1,
    form: 'users',
    header: 'Users',
    type: 'list',
    table: 'users'
  }
};

export interface IForm {
  minDatasets: number,
  form: string,
  header: string,
  type: string,
  table: string
}

export default { forms};