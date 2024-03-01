import app from './code';
import constants from './constants';
import entities from './entities';
import store from './store';

export function useWLH() {
  return {
    app: app,
    constants: constants,
    entities: entities,
    store: store,
  };
}
