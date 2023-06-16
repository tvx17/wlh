import path from "path";
import os from "os";
import { Sequelize } from "sequelize";

const dataDir = path.join(os.homedir(), 'wlh');
const databaseFile = path.join(dataDir, 'dwlhC.wd');

const connectionObject = new Sequelize({
  dialect: 'sqlite',
  storage: databaseFile,
});

export { connectionObject, dataDir,databaseFile };
