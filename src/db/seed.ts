import "reflect-metadata";
import User from "app/models/user.model";
import DBConfig from "config/db.config";
import { Logger } from "helpers/logger";
import { container } from "tsyringe";
import { UserRole } from "utils/type";

const logger: Logger = container.resolve('DBLogger');
const dbConfig: DBConfig = container.resolve(DBConfig);

export async function seed() {
    await createAdminAccount();
}

async function createAdminAccount(){
    try {

    const isAdminCreated = await User.findOne({where: {username: dbConfig.admin_initial_username}});

    if(isAdminCreated) return;

    const admin = await User.create({
        username: dbConfig.admin_initial_username,
        password:  dbConfig.admin_initial_password,
        role: UserRole.ADMIN
    });

    if(!admin){
        logger.info('Admin account created failed');
        return;
    }

    logger.info('Admin account created successfully', admin.username);
    } catch (error) {
        logger.info('Admin account created failed');
    }
}