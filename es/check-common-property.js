import { checkType } from './check-type';
function checkPropertyLimitType(key, property, value, limitTypes) {
    if (!limitTypes.some((type) => checkType(value, type))) {
        return {
            key,
            message: `${property} 使用类型限制为 ${limitTypes.toString()}`,
        };
    }
}
function checkPropertyEnum(key, propertyEnum, value, message) {
    const result = [];
    const limitTypes = ['string', 'number'];
    const limitTypeResult = checkPropertyLimitType(key, 'enum', value, limitTypes);
    if (limitTypeResult) {
        result.push(limitTypeResult);
        return result;
    }
    if (!propertyEnum.some((item) => item === value)) {
        result.push({
            key,
            message: message || `enum ${propertyEnum.toString()} 没有 ${value.toString()}`,
        });
    }
    return result;
}
function checkBestValue(key, bestValueKey, bestValue, value, message) {
    const result = [];
    const limitTypeConfig = {
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
    const limitTypeResult = checkPropertyLimitType(key, bestValueKey, value, limitTypes);
    if (limitTypeResult) {
        result.push(limitTypeResult);
        return result;
    }
    if (['minLength', 'minItems'].includes(bestValueKey) &&
        value.length < bestValue) {
        result.push({ key, message: message || `最小长度为 ${bestValue}` });
    }
    if (['maxLength', 'maxItems'].includes(bestValueKey) &&
        value.length > bestValue) {
        result.push({ key, message: message || `最大长度为 ${bestValue}` });
    }
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
