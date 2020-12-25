import { checkPropertyLimitType } from './check-common-property';

import { ValidateResult } from './interface';

function checkPropertyMultipleOf(
  key: string,
  multipleOf: number,
  value: number,
  message?: string
): ValidateResult[] {
  const result: ValidateResult[] = [];
  const limitTypeResult = checkPropertyLimitType(key, 'multipleOf', value, [
    'number',
  ]);

  if (limitTypeResult) {
    result.push(limitTypeResult);
    return result;
  }
  if (value === 0 || value % multipleOf > 0) {
    result.push({ key, message: message || `${value}不是${multipleOf}的倍数` });
  }
  return result;
}

export { checkPropertyMultipleOf };
