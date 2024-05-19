import "reflect-metadata";
import { container } from 'tsyringe';
import { Model, DataTypes } from 'sequelize';
import { ulid } from 'ulid';
import conn from '../../db/connection';
import User from './user.model';
import AppConfig from 'config/app.config';

export default class UserRefreshToken extends Model {
    declare token: string;
    declare userId: number;
    declare expiryDate: Date;

    static readonly createToken = async (userId: number) => {
        const ttl = container.resolve(AppConfig).jwt_refresh_expires_in_minutes;
        const expiredAt = new Date();

        expiredAt.setMinutes(expiredAt.getMinutes() + ttl);

        const refreshToken = await UserRefreshToken.create({
            token: ulid(),
            userId: userId,
            expiryDate: expiredAt.getTime(),
        });

        return refreshToken.token;
    }

    static readonly verifyExpiration = (expiryDate: Date) => {
        return expiryDate.getTime() > new Date().getTime();
    }
}

UserRefreshToken.init({
    token: {
        type: DataTypes.STRING(128),
        unique: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    expiryDate: {
        type: DataTypes.DATE,
    }
}, {
    sequelize: conn,
    tableName: 'user_refresh_tokens',
    modelName: 'userRefreshToken',
    underscored: true,
    timestamps: false
});