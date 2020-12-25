import { checkPropertyLimitType } from './check-common-property';

import { ValidateResult } from './interface';

function checkPropertyPattern(
  key: string,
  pattern: string,
  value: string,
  message?: string
): ValidateResult[] {
  const result: ValidateResult[] = [];
  const limitTypeResult = checkPropertyLimitType(key, 'pattern', value, [
    'string',
  ]);

  if (limitTypeResult) {
    result.push(limitTypeResult);
    return result;
  }

  const matchs = pattern.match(/^\/(.+)\/([gim]+)$/);
  let reg;
  if (matchs) {
    reg = new RegExp(matchs[1], matchs[2]);
  } else {
    reg = new RegExp(pattern);
  }

  if (!reg.test(value)) {
    result.push({ key, message: message || `${value}校验正则${reg}失败` });
  }
  return result;
}

export { checkPropertyPattern };
