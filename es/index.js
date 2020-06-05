import { checkType, isString } from './check-type';
function validate(json, schema) {
    const { required, properties } = schema;
    const requiredResult = (required && checkRequired(json, required)) || [];
    const propertyResult = (properties && checkProperty(json, properties)) || [];
    return [...requiredResult, ...propertyResult];
}
function checkRequired(json, required) {
    const result = [];
    const JsonKey = Object.keys(json);
    required.forEach((item) => {
        const key = isString(item) ? item : item.key;
        const message = isString(item) ? `${key}为必需字段` : item.message;
        !JsonKey.includes(key) && result.push({ key, message });
    });
    return result;
}
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
    const result = [];
    const { type, enum: propertyEnum, messages } = config;
    const typeResult = type && checkPropertyType(key, type, value, messages?.type);
    const enumResult = propertyEnum && checkPropertyEnum(key, propertyEnum, value, messages?.enum);
    typeResult && result.push(typeResult);
    enumResult && result.push(enumResult);
    return result;
}
function checkPropertyType(key, type, value, message) {
    if (!checkType(value, type)) {
        return {
            key,
            message: message || `类型错误，要求${type}类型`,
        };
    }
}
function checkPropertyEnum(key, propertyEnum, value, message) {
    if (!propertyEnum.some((item) => item === value)) {
        return {
            key,
            message: message || `enum ${propertyEnum.toString()} 没有 ${value.toString()}`,
        };
    }
}
export { validate, checkRequired, checkProperty };
export default validate;
