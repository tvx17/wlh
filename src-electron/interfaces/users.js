import {users} from 'app/src-electron/dbReference';

export const iUsers = {
  router: async (request_method, data) => {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(request_method, Object.keys(data.where).length);
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    if (request_method === 'get' && Object.keys(data.where).length === 0) {
      return await methods.all();
    }
    if (request_method === 'get' && Object.keys(data.where).length > 0) {
      return await methods.get(data);
    }
  },
  all   : async () => {
    return await projects.findAll();
  },
  get   : async (where = null, fields = null, orderBy = null) => {
    if (where == null) {
      return await users.findAll({raw: true});
    }
  }
};


