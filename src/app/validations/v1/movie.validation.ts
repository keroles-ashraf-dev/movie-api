import Joi from "joi";
import { MovieColor } from "utils/type";

export const createSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    year: Joi.number().integer().positive().required(),
    country: Joi.string().min(2).max(255).required(), 
    length: Joi.number().integer().positive().required(), 
    genre: Joi.string().min(1).max(255).required(), 
    color: Joi.string().valid(...Object.values(MovieColor)),
});

export const getSchema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    title: Joi.string().min(1).max(255).optional(),
    genre: Joi.string().min(1).max(255).optional(), 
});

export const paginateSchema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    title: Joi.string().min(1).max(255).optional(),
    genre: Joi.string().min(1).max(255).optional(),
    offset: Joi.number().integer().positive().optional(),
    limit: Joi.number().integer().positive().optional(),
});