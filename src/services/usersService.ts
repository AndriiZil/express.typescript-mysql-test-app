import { Repository } from 'typeorm/repository/Repository';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { HttpStatusCodes } from '../utils/httpStatuses';
import { customError } from '../utils';

interface INewUser {
    name: string;
    password: string;
}

class UsersService {

    static async create({name, password}: INewUser): Promise<User | Error> {
        const userRepository = getRepository(User);

        await checkUserByName(userRepository, name);

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User();
        newUser.name = name;
        newUser.password = passwordHash;
        await userRepository.save(newUser);

        delete newUser.password;

        return newUser;
    }

    static async login({name, password}: INewUser): Promise<string | Error> {
        const user = await getRepository(User)
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.name = :name', { name })
            .getOne();

        if (!user) {
            customError(`User with name: "${name}" was not found`, HttpStatusCodes.NOT_FOUND)
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            customError('User password is incorrect.', HttpStatusCodes.FAILED_USER_INPUT);
        }

        return jwt.sign({
            id: user.id
        }, process.env.SECRET, { expiresIn: 60 * 60 * 1000 });
    }

    static async getAll(): Promise<User[]> {
        const userRepository = getRepository(User);

        return userRepository.find({});
    }

    static async getById(id: number): Promise<User | Error> {
        const userRepository = getRepository(User);

        return checkIfUserExists(userRepository, id);
    }

    static async delete(id: number): Promise<void | Error> {
        const userRepository = getRepository(User);

        await checkIfUserExists(userRepository, id);

        await userRepository.delete(id);
    }

    static async update(id: number, name: string): Promise<void | Error> {
        const userRepository = getRepository(User);

        await checkIfUserExists(userRepository, id);

        await checkUserByName(userRepository, name);

        await userRepository
            .createQueryBuilder()
            .update(User)
            .set({name})
            .where('id = :id', {id})
            .execute();
    }

}

async function checkIfUserExists(userRepository: Repository<User>, id: number, name?: string): Promise<User | Error> {
    let user;

    if (id) {
        user = await userRepository.findOne({ id }, {relations: ['tasks']});
    } else if (name) {
        user = await userRepository.findOne({ name }, {relations: ['tasks']});
    } else {
        return;
    }

    if (!user) {
        customError(`User with such id: "${id}" was not found.`, HttpStatusCodes.NOT_FOUND);
    }

    return user;
}

async function checkUserByName(userRepository: Repository<User>, name: string): Promise<void | Error> {
    const user = await userRepository.findOne({ name });

    if (user) {
        customError(
            `User with name "${name}" already exists. Please use another one.`,
            HttpStatusCodes.FAILED_USER_INPUT
        );
    }
}

export default UsersService;
