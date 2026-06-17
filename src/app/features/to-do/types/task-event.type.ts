import { AppEventType } from '@core';
import { Task } from './task.type';

export type TaskEvent = {
    type: AppEventType,
    id: Task['id']
};

/*
id: Task['id'] добавил подобную конструкцию, чтобы менять тип id в одном месте
*/