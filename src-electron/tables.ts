import { DataTypes } from 'sequelize';
import { connectionObject } from './connection';

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

const chapters = connectionObject.define('chapters', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  book: { type: DataTypes.INTEGER, allowNull: false },
  project: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const scenes = connectionObject.define('scenes', {
  summary: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  chapter: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: true },
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
  chapters,
  scenes,
  cycles,
  universes,
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
  chapters,
  scenes,
  cycles,
  universes,
};
