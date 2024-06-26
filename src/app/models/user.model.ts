import { Model, DataTypes, CreateOptions } from 'sequelize';
import bcrypt from 'bcryptjs';
import conn from '../../db/connection';
import { UserRole } from '../../utils/type';

export default class User extends Model {
    declare id: number;
    declare username: string;
    declare password: string;
    declare role: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(64),
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
    },
    role: {
        type: DataTypes.ENUM({ values: Object.values(UserRole) }),
    }
}, {
    sequelize: conn,
    tableName: 'users',
    modelName: 'user',
    underscored: true,
    timestamps: false
});

User.beforeSave(async (user: User, options: CreateOptions) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
    }
});