import crud, { crudModes } from 'src/tvx/helper/crud';
import { currentProject } from "src/app/store";

const loadData = async (datatable: string, pkValue: number) => {
  const result = await crud.readByPk({
    destination: datatable,
    pkValue: pkValue,
    overrideCrudMode: crudModes.sequelize,
  });

  if (result) {
    result.isActive = result.isActive === 1;
  }

  return result;
};

const onSave = async (datatable: string, data: any) => {
  if(!data.hasOwnProperty('project')) {
    data.project = currentProject.value
  }
  const results = await crud.save({
    destination: datatable,
    data: data,
    overrideCrudMode: crudModes.sequelize,
  });
};

const methods = {
  loadData, onSave
};

export default methods;

export { methods, loadData, onSave };
