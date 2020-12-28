import { checkType } from './check-type';
import { checkPropertyEnum, checkBestValue } from './check-common-property';
import { checkPropertyPattern } from './check-string-property';
import { checkPropertyMultipleOf } from './check-number-property';
import { checkPropertyUniqueItems, checkPropertyItems, } from './check-array-property';
function checkProperty(json, properties) {
    const result = [];
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
function checkPropertyItem(key, value, config) {
    const { type, enum: propertyEnum, pattern, multipleOf, items, uniqueItems, messages, ...bestValueConfig } = config;
    const bestValueConfigKeys = Object.keys(bestValueConfig);
    const typeResult = checkPropertyType(key, type, value, messages?.type);
    const enumResult = propertyEnum
        ? checkPropertyEnum(key, propertyEnum, value, messages?.enum)
        : [];
    const patternResult = pattern
        ? checkPropertyPattern(key, pattern, value, messages?.pattern)
        : [];
    const multipleOfResult = multipleOf
        ? checkPropertyMultipleOf(key, multipleOf, value, messages?.multipleOf)
        : [];
    const uniqueItemsResult = uniqueItems
        ? checkPropertyUniqueItems(key, uniqueItems, value, messages?.uniqueItems)
        : [];
    const ItemsResult = items
        ? checkPropertyItems(key, items, value)
        : [];
    const bestValueResult = bestValueConfigKeys.length
        ? bestValueConfigKeys.reduce((result, bestValueKey) => {
            result.push(...checkBestValue(key, bestValueKey, bestValueConfig[bestValueKey], value, messages?.type));
            return result;
        }, [])
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
function checkPropertyType(key, type, value, message) {
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
