import { Model, DataTypes } from 'sequelize';
import conn from 'db/connection';
import { MovieColor } from 'utils/type';
import User from './user.model';
import Movie from './movie.model';

export default class UserFavoriteMovie extends Model {
    declare id: number;
    declare userId: number;
    declare movieId: number;
}

UserFavoriteMovie.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    movieId: {
        type: DataTypes.INTEGER,
        references: {
            model: Movie,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: conn,
    tableName: 'user_favorite_movies',
    modelName: 'userFavoriteMovie',
    underscored: true,
    timestamps: false
});