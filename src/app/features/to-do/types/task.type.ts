import { TaskStatus } from '@features/to-do/types';

export type Task = {
    id: number;
    text: string;
    description: string;
    status: TaskStatus;
};