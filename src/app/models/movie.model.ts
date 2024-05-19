import { Model, DataTypes, CreateOptions } from 'sequelize';
import conn from 'db/connection';
import { MovieColor } from 'utils/type';
import sequelize from 'sequelize';

export default class Movie extends Model {
    declare id: number;
    declare title: string;
    declare director: string;
    declare year: string;
    declare country: string;
    declare length: number;
    declare genre: string;
    declare color: string
    declare extData: string | null;
    declare tsvector: string
}

Movie.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(),
    },
    director: {
        type: DataTypes.STRING(),
    },
    year: {
        type: DataTypes.STRING(),
    },
    country: {
        type: DataTypes.STRING(),
    },
    length: {
        type: DataTypes.INTEGER,
    },
    genre: {
        type: DataTypes.STRING(),

    },
    color: {
        type: DataTypes.ENUM({ values: Object.values(MovieColor) }),
    },
    extData: {
        type: DataTypes.JSON(),
        allowNull: true,
        defaultValue: null,
    },
    tsvector: {
        type: DataTypes.TSVECTOR(),
    }
}, {
    sequelize: conn,
    tableName: 'movies',
    modelName: 'movie',
    underscored: true,
    timestamps: false
});

Movie.beforeSave(async (movie: Movie, options: CreateOptions) => { 
    if (movie.changed('title') || movie.changed('director') || movie.changed('genre')) {
        // @ts-ignore
        movie.tsvector = sequelize.fn(
            'to_tsvector', 
            'english', 
            `${movie.title.replace(/[^a-zA-Z ]/g, "")} || ' ' || ${movie.director.replace(/[^a-zA-Z ]/g, "")} || ' ' || ${movie.genre.replace(/[^a-zA-Z ]/g, "")}`
        );
    }
});

Movie.beforeBulkCreate(async (movies: Movie[], options: CreateOptions) => { 
    for(let i: number = 0; i < movies.length; i++){
        const movie = movies[i];
        
        // @ts-ignore
        movie.tsvector = sequelize.fn(
            'to_tsvector', 
            'english',
            `${movie.title.replace(/[^a-zA-Z ]/g, "")} || ' ' || ${movie.director.replace(/[^a-zA-Z ]/g, "")} || ' ' || ${movie.genre.replace(/[^a-zA-Z ]/g, "")}`
        );
        
    }
});