import checkProperty from './check-property';
import { isString } from './check-type';
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
export { validate, checkRequired, checkProperty };
export default validate;
