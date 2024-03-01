import dayjs from 'dayjs';
import { verbose } from '../constants/app';


export function message(file: string, method: string, message: string, isError = false, data?: any) {
  if (!verbose && !isError) {
    return;
  }


  if (!isError) {
    log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] - INFO - ${file} -> ${method}: ${message}`, data);
  } else {
    error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] - ERROR - ${file} -> ${method}: ${message}`, data);
  }
}

export function log(message: string, data?: any) {
  if (data) {
    console.log(message, data);
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

export function useLogging() {
  return { message, log, error };
}

export default {
  message, log, error
};
