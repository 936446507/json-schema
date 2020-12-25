import { checkPropertyLimitType } from './check-common-property';

import { ValidateResult } from './interface';

function checkPropertyUniqueItems(
  key: string,
  uniqueItems: boolean,
  value: any[],
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

export { checkPropertyUniqueItems };
