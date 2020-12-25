import { Data, checkType } from './check-type';

import {
  DataType,
  BestValueKey,
  ValidateResult,
  SchemaPropertyKey,
  SchemaPropertyEnum,
} from './interface';

// 检查类型限制
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

// 检查property枚举
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

  if (limitTypeResult) {
    result.push(limitTypeResult);
    return result;
  }
  if (!propertyEnum.some((item) => item === value)) {
    result.push({
      key,
      message:
        message || `enum ${propertyEnum.toString()} 没有 ${value.toString()}`,
    });
  }
  return result;
}

// 检查property最值
// minLength、maxLength、minNum、maxNum、exclusiveMinNum、exclusiveMaxNum
function checkBestValue(
  key: string,
  bestValueKey: BestValueKey,
  bestValue: number,
  value: number | string | any[],
  message: string
): ValidateResult[] {
  const result = [];
  const limitTypeConfig: {
    [key in BestValueKey]: DataType[];
  } = {
    minLength: ['string', 'array'],
    maxLength: ['string', 'array'],
    minNum: ['number'],
    maxNum: ['number'],
    exclusiveMinNum: ['number'],
    exclusiveMaxNum: ['number'],
    minItems: ['array'],
    maxItems: ['array'],
  };
  const limitTypes = limitTypeConfig[bestValueKey];
  const limitTypeResult = checkPropertyLimitType(
    key,
    bestValueKey,
    value,
    limitTypes
  );
  if (limitTypeResult) {
    result.push(limitTypeResult);
    return result;
  }

  // length检查
  if (
    ['minLength', 'minItems'].includes(bestValueKey) &&
    (value as string | any[]).length < bestValue
  ) {
    result.push({ key, message: message || `最小长度为 ${bestValue}` });
  }
  if (
    ['maxLength', 'maxItems'].includes(bestValueKey) &&
    (value as string | any[]).length > bestValue
  ) {
    result.push({ key, message: message || `最大长度为 ${bestValue}` });
  }

  // number类型最值检查
  if (bestValueKey === 'minNum' && value < bestValue) {
    result.push({ key, message: message || `最小值为 ${bestValue}` });
  }
  if (bestValueKey === 'maxNum' && value > bestValue) {
    result.push({ key, message: message || `最大值为 ${bestValue}` });
  }
  if (bestValueKey === 'exclusiveMinNum' && value <= bestValue) {
    result.push({ key, message: message || `开区间最小值为 ${bestValue}` });
  }
  if (bestValueKey === 'exclusiveMaxNum' && value >= bestValue) {
    result.push({ key, message: message || `开区间最大值为 ${bestValue}` });
  }

  return result;
}

export { checkPropertyLimitType, checkPropertyEnum, checkBestValue };
