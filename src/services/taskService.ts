import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { customError } from '../utils';
import { HttpStatusCodes } from '../utils/httpStatuses';
import {Repository} from 'typeorm/repository/Repository';

interface ICreateTask {
    title: string;
    text: string;
}

interface ITask {
    id: number;
    title: string;
    text: string;
    completed: boolean;
    createdAt: string;
    user: {
        id: number;
        name: string;
        password?: string;
        createdAt: string;
    }
}

class TaskService {

    static async create({ title, text } : ICreateTask, userId: number) {
        const userRepository = getRepository(User);
        const taskRepository = getRepository(Task);

        const currentUser = await userRepository.findOne({ id: userId })

        await TaskService.checkIfTaskExist(taskRepository, null, title);

        const newTask = new Task();
        newTask.user = currentUser;
        newTask.title = title;
        newTask.text = text;

        await taskRepository.save(newTask);

        return newTask;
    }

    static async getTaskById(id: number) {
        const taskRepository = getRepository(Task);

        const task = await TaskService.checkIfTaskExist(taskRepository, Number(id));
        console.log(task);
        // // @ts-ignore
        const preparedTasks = prepareTaskResponse([task]);
        return preparedTasks;
    }

    static async getAll() {
        const taskRepository = getRepository(Task);

        return taskRepository
            .createQueryBuilder('tasks')
            .leftJoinAndSelect('tasks.user', 'task')
            .getMany();

    }

    static async changeStatusToCompleted(id: number) {
        const taskRepository = getRepository(Task);

        await TaskService.checkIfTaskExist(taskRepository, Number(id));

        await taskRepository
            .createQueryBuilder()
            .update(Task)
            .set({ completed: true })
            .where('id = :id', { id: Number(id) })
            .execute();

    }

    static async update(id: number, body: any) {
        const taskRepository = getRepository(Task);

        await TaskService.checkIfTaskExist(taskRepository, id);

        await taskRepository
            .createQueryBuilder()
            .update(Task)
            .set(body)
            .where('id = :id', { id: Number(id) })
            .execute();
    }

    static async delete(id: number): Promise<void> {
        const taskRepository = getRepository(Task);

        await TaskService.checkIfTaskExist(taskRepository, id);

        await taskRepository.delete(id);
    }
    
    static async checkIfTaskExist(repository: Repository<Task>, id?: number, title?: string): Promise<ITask> {
        let task;

        if (id) {
            task = await repository.findOne({ id: Number(id) }, { relations: ['user']});
        } else if (title) {
            task = await repository.findOne({ title }, { relations: ['user']});
        } else {
            return;
        }

        if (!task) {
            customError(`Task with id ${id} was not found`, HttpStatusCodes.NOT_FOUND);
        }

        // @ts-ignore
        return task;
    }

}

function prepareTaskResponse(tasks: ITask[]) {
    return tasks.map(t => {
        return {
            ...t,
            user: {
                userId: t.user.id,
                name: t.user.name,
                createDate: t.user.createdAt,
            }
        }
    });
}

export default TaskService;
