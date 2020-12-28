import { isArray } from './check-type';
import { checkPropertyItem } from './check-property';
import { checkPropertyLimitType } from './check-common-property';
function checkPropertyUniqueItems(key, uniqueItems, value, message) {
    const result = [];
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
function checkPropertyItems(key, itemConfigs, arr) {
    const result = [];
    const isArrConfig = isArray(itemConfigs);
    if (isArrConfig &&
        arr.length !== itemConfigs.length) {
        result.push({
            key,
            message: 'items 配置与数组元素长度不一致',
        });
        return result;
    }
    for (let i = 0; i < arr.length; i++) {
        const validate = checkPropertyItem(`${key} arr[${i}]`, arr[i], isArray(itemConfigs) ? itemConfigs[i] : itemConfigs);
        result.push(...validate);
    }
    return result;
}
export { checkPropertyUniqueItems, checkPropertyItems };
