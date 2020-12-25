
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
'use strict';

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

function checkPropertyPattern(key, pattern, value, message) {
    const result = [];
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
    }
    else {
        reg = new RegExp(pattern);
    }
    if (!reg.test(value)) {
        result.push({ key, message: message || `${value}校验正则${reg}失败` });
    }
    return result;
}

function checkPropertyMultipleOf(key, multipleOf, value, message) {
    const result = [];
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

const json = {
    key: 'ddd',
    key1: 1,
    key2: 1,
    key3: 10,
    key4: 11,
    key5: 'ssssfdsafs',
    key6: [1, 1, 1, 2],
};
const schema = {
    required: [
        {
            key: 'key3',
            message: 'message',
        },
    ],
    properties: {
        key: {
            type: 'string',
            minLength: 10,
        },
        key2: {
            type: 'number',
            enum: [1, 2],
        },
        key3: {
            type: 'number',
            exclusiveMinNum: 10,
            maxNum: 20,
        },
        key4: {
            type: 'number',
            multipleOf: 10,
        },
        key5: {
            type: 'string',
            pattern: 'ss+',
        },
        key6: {
            type: 'array',
            uniqueItems: true,
        },
    },
};
const result = validate(json, schema);
console.log(result);
