import { TestBed } from '@angular/core/testing';

import { ToDoService } from './to-do.service';

describe('ToDoService', () => {
    let service: ToDoService;

    beforeEach(() => {
        TestBed.resetTestingModule(); // сбрасываю сервис перед каждым тестом
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToDoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add task', () => {
        service.addTask({text: '2', description: '2'});
        expect(service.tasks().length).toBe(2);
        
        const newItem = service.tasks().find(item => item.id === 2);
        expect(newItem).toBeTruthy();
    });

    it('should remove and length 0', () => {
        service.removeTask(1);
        expect(service.tasks().length).toBe(0);
    });

    it('should update task', () => {
        service.updateTask({
            id: 1,
            text: 'FirstNew',
            description: 'DescriptionNew'
        });

        expect(service.tasks()).toEqual([
            {
                id: 1,
                text: 'FirstNew',
                description: 'DescriptionNew'
            }
        ]);
    });
});
