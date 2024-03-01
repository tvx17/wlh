import * as crud from 'src/app/code/crud';
import * as helper from 'src/app/code/helper';
import * as i18n from 'src/app/code/i18n';
import * as logging from 'src/app/code/logging';
import * as misc from 'src/app/code/index';

export function useApp() {
  return {
    crud,
    helper,
    i18n,
    logging,
    misc
  };

};
