import { Data, DataType, checkType, isString } from './check-type';

import {
  ValidateResult,
  Json,
  Schema,
  SchemaRequired,
  SchemaPropertyConfig,
  SchemaPropertyConfigItem,
  SchemaPropertyEnum,
} from './interface';

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
// property 检查
function checkProperty(
  json: Json,
  properties: SchemaPropertyConfig
): ValidateResult[] {
  const result: ValidateResult[] = [];

  for (let key in properties) {
    const value = json[key];
    if (!value) {
      const message = `json无${key}字段`;
      result.push({ key, message });
      continue;
    }
    const config = properties[key];
    const propertyItemResult = checkPropertyItem(key, value, config);
    result.push(...propertyItemResult);
  }
  return result;
}
// 检查property各项
function checkPropertyItem(
  key: string,
  value: Data,
  config: SchemaPropertyConfigItem
): ValidateResult[] {
  const result: ValidateResult[] = [];

  const { type, enum: propertyEnum, messages } = config;
  const typeResult =
    type && checkPropertyType(key, type, value, messages?.type);
  const enumResult =
    propertyEnum && checkPropertyEnum(key, propertyEnum, value, messages?.enum);

  typeResult && result.push(typeResult);
  enumResult && result.push(enumResult);
  return result;
}
function checkPropertyType(
  key: string,
  type: DataType,
  value: Data,
  message: string
): ValidateResult | void {
  if (!checkType(value, type)) {
    return {
      key,
      message: message || `类型错误，要求${type}类型`,
    };
  }
}

function checkPropertyEnum(
  key: string,
  propertyEnum: SchemaPropertyEnum[],
  value: Data,
  message: string
): ValidateResult | void {
  if (!propertyEnum.some((item) => item === value)) {
    return {
      key,
      message:
        message || `enum ${propertyEnum.toString()} 没有 ${value.toString()}`,
    };
  }
}

export { validate, checkRequired, checkProperty };
export default validate;
