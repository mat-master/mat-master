import { InferType, AnySchema, ValidationError } from 'yup';
import { res400, Response } from './res';

export const validateBody = async <Schema extends AnySchema>(schema: Schema, body: any): Promise<InferType<Schema> | Response> => {
    try {
        return await schema.validate(body);
    } catch(err) {
        if(err instanceof ValidationError) {
            return res400((err as ValidationError).errors[0]);
        }
    }
    return res400("Invalid body");
}