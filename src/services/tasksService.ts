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

class TasksService {

    static async create({ title, text } : ICreateTask, userId: number): Promise<Task> {
        const usersRepository = getRepository(User);
        const tasksRepository = getRepository(Task);

        const currentUser = await usersRepository.findOne({ id: userId });

        delete currentUser.password;

        const task = await tasksRepository.findOne({ title });

        if (task) {
            customError(`Task with title "${title}" already exists.`, HttpStatusCodes.FAILED_USER_INPUT);
        }

        const newTask = new Task();
        newTask.user = currentUser;
        newTask.title = title;
        newTask.text = text;

        await tasksRepository.save(newTask);

        return newTask;
    }

    static async getAll(): Promise<Task[] | []> {
        const taskRepository = getRepository(Task);

        return taskRepository
            .createQueryBuilder('tasks')
            .leftJoinAndSelect('tasks.user', 'task')
            .getMany();
    }

    static async getAllCurrentUserTasks(id: number): Promise<Task[] | []> {
        return getRepository(Task)
            .createQueryBuilder('task')
            .where('task.user.id = :id', { id })
            .getMany();
    }

    static async getTaskById(id: number): Promise<Task | Error> {
        const taskRepository = getRepository(Task);

        return checkIfTaskExistById(taskRepository, id);
    }

    static async changeStatusToCompleted(id: number): Promise<void | Error> {
        const taskRepository = getRepository(Task);

        await checkIfTaskExistById(taskRepository, Number(id));

        await taskRepository
            .createQueryBuilder('task')
            .update(Task)
            .set({ completed: true })
            .where('id = :id', { id: Number(id) })
            .execute();

    }

    static async update(id: number, body: any): Promise<void | Error> {
        const { title } = body;
        const taskRepository = getRepository(Task);

        await checkIfTaskExistById(taskRepository, id);
        await checkIfTaskExistsByTitle(taskRepository, title);

        await taskRepository
            .createQueryBuilder()
            .update(Task)
            .set(body)
            .where('id = :id', { id })
            .execute();
    }

    static async delete(id: number): Promise<void> {
        const taskRepository = getRepository(Task);

        await checkIfTaskExistById(taskRepository, id);

        await getRepository(Task).delete(id);
    }

}

async function checkIfTaskExistById(taskRepository: Repository<Task>, id: number) {
    const task = await taskRepository.findOne({ id }, { relations: ['user']});

    if (!task) {
        customError(`Task with id ${id} was not found.`, HttpStatusCodes.FAILED_USER_INPUT);
    }

    return task;
}

async function checkIfTaskExistsByTitle(taskRepository: Repository<Task>, title: string) {
    const task = await taskRepository.findOne({ title });

    if (task) {
        customError(`Task with title "${title}" already exists.`, HttpStatusCodes.FAILED_USER_INPUT);
    }
}

export default TasksService;
