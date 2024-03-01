import books from './Books';
import chapters from './Chapters';
import chapterSections from './ChapterSections';
import characters from './Characters';
import forms from './Forms';
import locations from './Locations';
import objects from './Objects';
import projects from './Projects';
import settings from './Settings';
import structure from './Structure';
import texts from './Texts';
import universes from './Universes';
import universeSections from './UniverseSections';
import users from './Users';
import log from '../../common/log';


/*import structures from './Structure';*/
/*import contents from './Contents';*/

/*export const tables = {
 projects: {table: 'projects', interface: 'Project'},
 users: {table: 'users', interface: 'User'},
 settings: {table: 'settings', interface: 'Setting'},
 structures: {table: 'structures', interface: 'Structure'},
 contents: {table: 'contents', interface: 'Content'},
 };*/

export async function setup() {
  log.message('Setting up entities');
  const userId = await users.setup();
  const projectId = await projects.setup(userId);
  const bookId = await books.setup(projectId);
  const chapterId = await chapters.setup(bookId);
  const textId = await texts.setup(chapterId);

  await objects.setup(projectId);
  await characters.setup(projectId);
  await locations.setup(projectId);
  await universes.setup();
  await universeSections.setup();
  await chapterSections.setup();
  await forms.setup();
  await structure.setup(bookId, chapterId, textId, projectId);

  await settings.setup(projectId);
}

export default { setup };
