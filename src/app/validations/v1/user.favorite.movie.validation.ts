import Joi from "joi";
import { MovieColor } from "utils/type";

export const createSchema = Joi.object({
    movie_id: Joi.number().integer().positive().required(),
});

export const getSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});