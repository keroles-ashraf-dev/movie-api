import { Model, DataTypes } from 'sequelize';
import conn from 'db/connection';
import { MovieColor } from 'utils/type';

export default class Movie extends Model {
    declare id: number;
    declare title: string;
    declare director: string;
    declare year: number;
    declare country: string;
    declare length: number;
    declare genre: string;
    declare color: string
    declare extData: string | null;
}

Movie.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.TSVECTOR(),
    },
    director: {
        type: DataTypes.STRING(),
    },
    year: {
        type: DataTypes.INTEGER,
    },
    country: {
        type: DataTypes.STRING(),
    },
    length: {
        type: DataTypes.INTEGER,
    },
    genre: {
        type: DataTypes.TSVECTOR(),

    },
    color: {
        type: DataTypes.ENUM({ values: Object.values(MovieColor) }),
    },
    extData: {
        type: DataTypes.JSON(),
        allowNull: true,
        defaultValue: null,
    }
}, {
    sequelize: conn,
    tableName: 'movies',
    modelName: 'movie',
    underscored: true,
    timestamps: false
});