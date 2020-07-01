import checkProperty from './check-property';
import { ValidateResult, Json, Schema, SchemaRequired } from './interface';
declare function validate(json: Json, schema: Schema): ValidateResult[];
declare function checkRequired(json: Json, required: SchemaRequired): ValidateResult[];
export { validate, checkRequired, checkProperty };
export default validate;
