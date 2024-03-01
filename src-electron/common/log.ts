const dayjs = require('dayjs');

import { verbose } from '../settings';

export function message(message: string, type = 'info', data?: any) {
  if (!verbose) return;
  if(message.includes('**') && type === 'info') {
    const headMessage = message.substring(0, message.indexOf('**'));
    message = message.substring(message.indexOf('**') + 2);
    head(headMessage);
  }

  const _message = `[${dayjs().format('YYYY-MM-DD - HH:mm:ss')}] - SEVERITY - ${message}`;

  switch (type) {
    case 'info':
      log(_message.replace('SEVERITY', 'INFO'), data);
      break;
    case 'error':
      error(_message.replace('SEVERITY', 'ERROR'), data);
      break;
    default:
      log(_message.replace('SEVERITY', 'INFO'), data);
  }
}

export function log(message: string, data?: any) {
  if (data) {
    console.log(message, data);
    return;
  } else {
    console.log(message);
  }
}

export function error(message: string, data?: any) {
  if (data) {
    console.error(message, data);
  } else {
    console.error(message);
  }
}
export function head(message: string) {
  console.log('******************************************************************')
  console.log('** ' + message);
  console.log('******************************************************************')
}

export default { message, error, log, head };
