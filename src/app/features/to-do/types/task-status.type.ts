import { TASK_STATUS } from '@features/to-do/constants';

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];