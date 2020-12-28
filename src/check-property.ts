import { Data, checkType } from './check-type';
import { checkPropertyEnum, checkBestValue } from './check-common-property';
import { checkPropertyPattern } from './check-string-property';
import { checkPropertyMultipleOf } from './check-number-property';
import {
  checkPropertyUniqueItems,
  checkPropertyItems,
} from './check-array-property';

import {
  DataType,
  BestValueKey,
  ValidateResult,
  Json,
  SchemaPropertyConfig,
  SchemaPropertyConfigItem,
} from './interface';

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
  const {
    type,
    enum: propertyEnum,
    pattern,
    multipleOf,
    items,
    uniqueItems,
    messages,
    ...bestValueConfig
  } = config;
  const bestValueConfigKeys = Object.keys(bestValueConfig) as BestValueKey[];

  const typeResult = checkPropertyType(key, type, value, messages?.type);
  const enumResult = propertyEnum
    ? checkPropertyEnum(key, propertyEnum, value, messages?.enum)
    : [];
  const patternResult = pattern
    ? checkPropertyPattern(key, pattern, value as string, messages?.pattern)
    : [];
  const multipleOfResult = multipleOf
    ? checkPropertyMultipleOf(
        key,
        multipleOf,
        value as number,
        messages?.multipleOf
      )
    : [];
  const uniqueItemsResult = uniqueItems
    ? checkPropertyUniqueItems(
        key,
        uniqueItems,
        value as any[],
        messages?.uniqueItems
      )
    : [];
  const ItemsResult = items
    ? checkPropertyItems(key, items, value as DataType[])
    : [];

  // 检查最值
  const bestValueResult = bestValueConfigKeys.length
    ? bestValueConfigKeys.reduce((result, bestValueKey) => {
        result.push(
          ...checkBestValue(
            key,
            bestValueKey,
            bestValueConfig[bestValueKey],
            value as number | string | any[],
            messages?.type
          )
        );
        return result;
      }, [] as ValidateResult[])
    : [];

  return [
    ...typeResult,
    ...enumResult,
    ...patternResult,
    ...multipleOfResult,
    ...uniqueItemsResult,
    ...ItemsResult,
    ...bestValueResult,
  ];
}
// 检查property类型
function checkPropertyType(
  key: string,
  type: DataType,
  value: Data,
  message: string
): ValidateResult[] {
  const result = [];
  if (!checkType(value, type)) {
    result.push({
      key,
      message: message || `类型错误，要求${type}类型`,
    });
  }
  return result;
}

export { checkPropertyItem };
export default checkProperty;
