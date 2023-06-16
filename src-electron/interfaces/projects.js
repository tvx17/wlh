import {projects} from 'app/src-electron/dbReference';

export const iProjects = {
  router : async (request_method, data) => {
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
  delete : async (id) => {
    projects.update({isActive: 0}, {where: {id: id}});
  },
  postPut: async (args) => {
  },
  post   : async (args) => {
    console.log('In Projekten, POST');
    console.log(args);
    const newProject = projects.build({name: args['name'], description: args['description'], owner: args['owner'], isActive: 1});
    await newProject.save();
  },
  put    : async (args) => {
    projects.update({name: args['name'], description: args['description'], owner: args['owner'], isActive: 1}, {where: {id: args['id']}});
  },
  getAll : async () => {
    return await projects.findAll({raw: true});
  },
  getById: async (id) => {
    return await iProjects.getById(id, {raw: true});
  },
  get    : async (args = null) => {
    console.log('Nun die Args');
    console.log(args)
    let where = null;
    let fields = null;
    let orderBy = null;
    if (args == null) {
      return iProjects.getAll();
    }
    if (Object.keys(args).length === 0 && args != null && Number.isInteger(args)) {
      return iProjects.getById(args);
    }
    if(Object.keys(args).length > 0 && !args.hasOwnProperty('where') && !args.hasOwnProperty('fields') && !args.hasOwnProperty('orderBy')) {
      args['where'] = args
    }
    if (args.hasOwnProperty('where')) {
      where = args.where;
    }
    if (args.hasOwnProperty('fields')) {
      fields = args.fields;
    }
    if (args.hasOwnProperty('orderBy')) {
      orderBy = args.orderBy;
    }
    console.log('Und nun:')

    return await projects.findAll({where: args['where'], raw: true})


  }
};


