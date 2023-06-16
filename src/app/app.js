const runMode = 'app';

const setupCheck = async () => {
  if (runMode === 'app') {
    return await window.db.setupCheck();
  } else {
    //api['get'];
  }
};

const app = {
  setupCheck
};
export default app;

export { app,setupCheck };
