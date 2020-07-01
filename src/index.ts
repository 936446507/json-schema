import checkProperty from './check-property';
import { isString } from './check-type';

import { ValidateResult, Json, Schema, SchemaRequired } from './interface';

function validate(json: Json, schema: Schema): ValidateResult[] {
  const { required, properties } = schema;
  const requiredResult = (required && checkRequired(json, required)) || [];
  const propertyResult = (properties && checkProperty(json, properties)) || [];

  return [...requiredResult, ...propertyResult];
}

// required 检查
function checkRequired(json: Json, required: SchemaRequired): ValidateResult[] {
  const result: ValidateResult[] = [];
  const JsonKey = Object.keys(json);
  required.forEach((item) => {
    const key = isString(item) ? item : item.key;
    const message = isString(item) ? `${key}为必需字段` : item.message;
    !JsonKey.includes(key) && result.push({ key, message });
  });
  return result;
}

export { validate, checkRequired, checkProperty };
export default validate;
