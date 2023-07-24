import project from 'src/app/project';
import user from 'src/app/user';

const runMode = 'app';

const setupCheck = async () => {
  if (runMode === 'app') {
    return await window.db.setupCheck();
  } else {
    //api['get'];
  }
};

const init= async () => {
  await project.onStartup()
  await user.onStartup()
}

const app = {
  setupCheck,
  init
};
export default app;

export { app,setupCheck, init};
