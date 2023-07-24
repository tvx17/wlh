import { DataTypes } from 'sequelize';
import { connectionObject } from './connection';

const settings = connectionObject.define('settings', {
  key: { type: DataTypes.STRING(100), allowNull: false },
  categorisation: { type: DataTypes.STRING(200), allowNull: true },
  values: { type: DataTypes.JSON, allowNull: true },
});

const projects = connectionObject.define('projects', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  owner: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const users = connectionObject.define('users', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  firstname: { type: DataTypes.STRING(100), allowNull: false },
  lastname: { type: DataTypes.STRING(100), allowNull: false },
  pseudonym: { type: DataTypes.STRING(100), allowNull: false },
  gender: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const characters = connectionObject.define('characters', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  dynamicData: { type: DataTypes.JSON, allowNull: true },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});
const locations = connectionObject.define('locations', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  dynamicData: { type: DataTypes.JSON, allowNull: true },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});
const objects = connectionObject.define('objects', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  dynamicData: { type: DataTypes.JSON, allowNull: true },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});
const books = connectionObject.define('books', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  cycle: { type: DataTypes.INTEGER, allowNull: true },
  universe: { type: DataTypes.INTEGER, allowNull: true },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const structure = connectionObject.define('structure', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  order: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: true },
  options: { type: DataTypes.JSON, allowNull: true },
  parent: { type: DataTypes.INTEGER, allowNull: true },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const texts = connectionObject.define('texts', {
  summary: { type: DataTypes.STRING(250), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  text: { type: DataTypes.TEXT, allowNull: true },
  structureId: { type: DataTypes.INTEGER, allowNull: false },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const cycles = connectionObject.define('cycles', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  universe: { type: DataTypes.INTEGER, allowNull: true },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const universes = connectionObject.define('universes', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});



const tables: { [index: string]: any } = {
  projects,
  users,
  characters,
  locations,
  objects,
  books,
  cycles,
  universes,
  settings,
  structure,
  texts,
};

export default tables;

export {
  tables,
  projects,
  users,
  characters,
  locations,
  objects,
  books,
  cycles,
  universes,
  settings,
  structure,
  texts,
};
