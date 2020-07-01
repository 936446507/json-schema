'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function checkType(data, type) {
    const reg = new RegExp(`${type}`, 'gi');
    return reg.test(Object.prototype.toString.call(data));
}
function isString(data) {
    return checkType(data, 'String');
}

function checkPropertyLimitType(key, property, value, limitTypes) {
    if (!limitTypes.some((type) => checkType(value, type))) {
        return {
            key,
            message: `${property} 使用类型限制为 ${limitTypes.toString()}`,
        };
    }
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
    const { type, enum: propertyEnum, messages, ...bestValueConfig } = config;
    const bestValueConfigKeys = Object.keys(bestValueConfig);
    const typeResult = type && checkPropertyType(key, type, value, messages?.type);
    const enumResult = propertyEnum && checkPropertyEnum(key, propertyEnum, value, messages?.enum);
    const bestValueResult = bestValueConfigKeys.length &&
        bestValueConfigKeys.reduce((result, bestValueKey) => {
            result.push(...checkBestValue(key, bestValueKey, bestValueConfig[bestValueKey], value, messages?.type));
            return result;
        }, []);
    typeResult && typeResult.length && result.push(...typeResult);
    enumResult && enumResult.length && result.push(...enumResult);
    bestValueResult && bestValueResult.length && result.push(...bestValueResult);
    return result;
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
function checkPropertyEnum(key, propertyEnum, value, message) {
    const result = [];
    const limitTypes = ['string', 'number'];
    const limitTypeResult = checkPropertyLimitType(key, 'enum', value, limitTypes);
    limitTypeResult && result.push(limitTypeResult);
    if (!propertyEnum.some((item) => item === value)) {
        result.push({
            key,
            message: message || `enum ${propertyEnum.toString()} 没有 ${value.toString()}`,
        });
    }
    return result;
}
function checkBestValue(key, bestValueKey, bestValue, value, message) {
    console.log(key, bestValue, value, message);
    const result = [];
    const limitTypeConfig = {
        minLength: ['string', 'array'],
        maxLength: ['string', 'array'],
        minNum: ['number'],
        maxNum: ['number'],
    };
    const limitTypes = limitTypeConfig[bestValueKey];
    const limitTypeResult = checkPropertyLimitType(key, bestValueKey, value, limitTypes);
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

exports.checkProperty = checkProperty;
exports.checkRequired = checkRequired;
exports.default = validate;
exports.validate = validate;
