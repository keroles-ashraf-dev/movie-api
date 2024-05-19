import { Sequelize } from 'sequelize';
import { container } from "tsyringe";
import DBConfig from 'config/db.config';

const dBConfig: DBConfig = container.resolve(DBConfig);

const conn = new Sequelize({
    dialect: "postgres",
    host: dBConfig.db_host,
    port: dBConfig.db_port,
    database: dBConfig.db_name,
    username: dBConfig.db_user,
    password: dBConfig.db_password,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000, // 30 seconds
        idle: 60000, // one minute
    },
});

export default conn;