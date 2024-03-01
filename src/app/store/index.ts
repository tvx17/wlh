import {ref} from "vue";

//TODO: change current to 0
export const projectCurrent = ref<number>(1);
export const projectData = ref<any>({});

export const useUniverses = ref<boolean>(false);
export const useUniverseSections = ref<boolean>(false);

export default {projectCurrent, projectData, useUniverses, useUniverseSections}
