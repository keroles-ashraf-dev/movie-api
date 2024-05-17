import Joi from "joi";

export const createSchema = Joi.object({
    movie_id: Joi.number().integer().positive().required(),
});

export const getSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});