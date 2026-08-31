import { TaskStatus } from '@features/to-do/types';

export type Task = {
    id: string;
    text: string;
    description: string;
    status: TaskStatus;
};