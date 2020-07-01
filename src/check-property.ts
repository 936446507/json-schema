import { Data, checkType } from './check-type';

import {
  DataType,
  BestValueKey,
  ValidateResult,
  SchemaPropertyKey,
  Json,
  SchemaPropertyConfig,
  SchemaPropertyConfigItem,
  SchemaPropertyEnum,
} from './interface';

function checkPropertyLimitType(
  key: string,
  property: SchemaPropertyKey,
  value: Data,
  limitTypes: DataType[]
): ValidateResult | void {
  if (!limitTypes.some((type) => checkType(value, type))) {
    return {
      key,
      message: `${property} 使用类型限制为 ${limitTypes.toString()}`,
    };
  }
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
  const { type, enum: propertyEnum, messages, ...bestValueConfig } = config;
  const bestValueConfigKeys = Object.keys(bestValueConfig) as BestValueKey[];
  const typeResult =
    type && checkPropertyType(key, type, value, messages?.type);
  const enumResult =
    propertyEnum && checkPropertyEnum(key, propertyEnum, value, messages?.enum);
  // 检查最值
  const bestValueResult =
    bestValueConfigKeys.length &&
    bestValueConfigKeys.reduce((result, bestValueKey) => {
      result.push(
        ...checkBestValue(
          key,
          bestValueKey,
          bestValueConfig[bestValueKey],
          value as Number,
          messages?.type
        )
      );
      return result;
    }, []);

  typeResult && typeResult.length && result.push(...typeResult);
  enumResult && enumResult.length && result.push(...enumResult);
  bestValueResult && bestValueResult.length && result.push(...bestValueResult);
  return result;
}
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

function checkPropertyEnum(
  key: string,
  propertyEnum: SchemaPropertyEnum[],
  value: Data,
  message: string
): ValidateResult[] {
  const result = [];
  const limitTypes: DataType[] = ['string', 'number'];
  const limitTypeResult = checkPropertyLimitType(
    key,
    'enum',
    value,
    limitTypes
  );

  limitTypeResult && result.push(limitTypeResult);
  if (!propertyEnum.some((item) => item === value)) {
    result.push({
      key,
      message:
        message || `enum ${propertyEnum.toString()} 没有 ${value.toString()}`,
    });
  }
  return result;
}

function checkBestValue(
  key: string,
  bestValueKey: BestValueKey,
  bestValue: number,
  value: Number,
  message: string
): ValidateResult[] {
  console.log(key, bestValue, value, message);
  const result = [];
  const limitTypeConfig: {
    [key in BestValueKey]: DataType[];
  } = {
    minLength: ['string', 'array'],
    maxLength: ['string', 'array'],
    minNum: ['number'],
    maxNum: ['number'],
  };
  const limitTypes = limitTypeConfig[bestValueKey];
  const limitTypeResult = checkPropertyLimitType(
    key,
    bestValueKey,
    value,
    limitTypes
  );
  limitTypeResult && result.push(limitTypeResult);
  if (bestValueKey.indexOf('min') >= 0 && value < bestValue) {
    result.push({
      key,
      message: message || `最小值为 ${bestValue}`,
    });
  }
  if (bestValueKey.indexOf('max') >= 0 && value > bestValue) {
    result.push({
      key,
      message: message || `最大值为 ${bestValue}`,
    });
  }

  return result;
}

export {
  checkProperty,
  checkPropertyItem,
  checkPropertyType,
  checkPropertyEnum,
  checkBestValue,
};
export default checkProperty;
