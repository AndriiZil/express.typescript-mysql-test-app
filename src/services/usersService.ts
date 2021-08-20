import { Repository } from 'typeorm/repository/Repository';
import { DeleteResult, getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { HttpStatusCodes } from '../utils/httpStatuses';
import { customError } from '../utils';

interface IUser {
    name: string;
    password: string;
}

class UsersService {

    static async create({ name, password }: IUser) {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne({ name });

        if (user) {
            customError('User already exists', HttpStatusCodes.FAILED_USER_INPUT);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User();
        newUser.name = name;
        newUser.password = passwordHash;
        await userRepository.save(newUser);

        return formatUser([newUser])[0];
    }

    static async login({ name, password }: IUser) {
        const userRepository = getRepository(User);

        const user = await UsersService.checkIfUserExists(userRepository, null, name);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            customError('User password is incorrect.', HttpStatusCodes.FAILED_USER_INPUT);
        }

        return jwt.sign({
            id: user.id
        }, 'secret', { expiresIn: 60 * 60 }); // TODO move to env
    }

    static async getById(id: number) {
        const userRepository = getRepository(User);
        const user = await UsersService.checkIfUserExists(userRepository, id);

        return user
    }

    static async getAll() {
        const userRepository = getRepository(User);

        return userRepository.find();
    }


    static async delete(id: number): Promise<DeleteResult> {
        const userRepository = getRepository(User);

        await UsersService.checkIfUserExists(userRepository, id);

        return userRepository.delete(id);
    }

    static async update(id: number, body: object) {
        const userRepository = getRepository(User);

        await UsersService.checkIfUserExists(userRepository, id);

        await userRepository
            .createQueryBuilder()
            .update(User)
            .set(body)
            .where('id = :id', { id })
            .execute();
    }

    static async checkIfUserExists(repository: Repository<User>, id?: number, name?: string) {
        let user;
        const condition = id ? `such id ${id}` : `such name ${name}`;

        if (id) {
            user = await repository.findOne({ id }, { relations: ['tasks']})
        } else if (name) {
            user = await repository.findOne({ name }, { relations: ['tasks']})
        } else {
            return;
        }

        if (!user) {
            customError(`User with ${condition} was not found`, HttpStatusCodes.NOT_FOUND);
        }

        return user;
    }

}

function formatUser(users: User[]) {
    return users.map(user => {
        return {
            userId: user.id,
            name: user.name,
            createdAt: user.createdAt,
        }
    });
}

export default UsersService;
