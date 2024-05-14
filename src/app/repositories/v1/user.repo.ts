import "reflect-metadata";
import { singleton } from 'tsyringe';
import User from 'app/models/user.model';

export interface BaseUserRepo {
    create(data: Record<string, any>): Promise<User>;

    findOne(query: any): Promise<User | null>;

    findAll(query: any): Promise<User[]>;

    update(user: User | number, data: Record<string, any>): Promise<User | null>;

    delete(query: any): Promise<boolean>;
}

@singleton()
export class UserRepo implements BaseUserRepo {
    create = async (data: Record<string, any>): Promise<User> => {
        const user = await User.create(data);

        return user;
    }

    findOne = async (query: any): Promise<User | null> => {
        const user = await User.findOne(query);

        return user;
    }

    findAll = async (query: any): Promise<User[]> => {
        const users = await User.findAll(query);

        return users;
    }

    update = async (userOrId: User | number, data: Record<string, any>): Promise<User | null> => {
        let user: User | null;

        if (userOrId instanceof Number) {
            user = await this.findOne({ where: { id: userOrId } });
        } else {
            user = userOrId as User;
        }

        if(!user) return null;

        const modifiedUser = await user.update(data);

        return modifiedUser;
    }

    delete = async (query: any): Promise<boolean> => {
        const deletedNum = await User.destroy(query);

        return deletedNum > 0;
    }
}