import { isArray } from './check-type';
import { checkPropertyItem } from './check-property';
import { checkPropertyLimitType } from './check-common-property';

import {
  DataType,
  ValidateResult,
  SchemaPropertyConfigItem,
} from './interface';

function checkPropertyUniqueItems(
  key: string,
  uniqueItems: boolean,
  value: DataType[],
  message?: string
): ValidateResult[] {
  const result: ValidateResult[] = [];
  const limitTypeResult = checkPropertyLimitType(key, 'uniqueItems', value, [
    'array',
  ]);

  if (limitTypeResult) {
    result.push(limitTypeResult);
    return result;
  }

  if (uniqueItems && new Set(value).size < value.length) {
    result.push({ key, message: message || `[${value}]数组元素不唯一` });
  }
  return result;
}

function checkPropertyItems(
  key: string,
  itemConfigs: SchemaPropertyConfigItem | SchemaPropertyConfigItem[],
  arr: DataType[]
): ValidateResult[] {
  const result: ValidateResult[] = [];
  const isArrConfig = isArray(itemConfigs);
  if (
    isArrConfig &&
    arr.length !== (itemConfigs as SchemaPropertyConfigItem[]).length
  ) {
    result.push({
      key,
      message: 'items 配置与数组元素长度不一致',
    });
    return result;
  }

  for (let i = 0; i < arr.length; i++) {
    const validate = checkPropertyItem(
      `${key} arr[${i}]`,
      arr[i],
      isArray(itemConfigs) ? itemConfigs[i] : itemConfigs
    );
    result.push(...validate);
  }

  return result;
}

export { checkPropertyUniqueItems, checkPropertyItems };
