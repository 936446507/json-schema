import { ValidateResult, Json, Schema, SchemaRequired, SchemaPropertyConfig } from './interface';
declare function validate(json: Json, schema: Schema): ValidateResult[];
declare function checkRequired(json: Json, required: SchemaRequired): ValidateResult[];
declare function checkProperty(json: Json, properties: SchemaPropertyConfig): ValidateResult[];
export { validate, checkRequired, checkProperty };
export default validate;
