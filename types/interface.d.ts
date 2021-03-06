import { Data } from './check-type';
export declare type DataType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
export declare type BestValueKey = 'minLength' | 'maxLength' | 'minNum' | 'maxNum' | 'exclusiveMinNum' | 'exclusiveMaxNum' | 'minItems' | 'maxItems';
export declare type ValidateResult = {
    key: string;
    message: string;
};
export declare type Json = {
    [key: string]: Data;
};
export declare type Schema = {
    required?: SchemaRequired;
    properties?: SchemaPropertyConfig;
};
export declare type SchemaRequired = (string | {
    key: string;
    message: string;
})[];
export declare type SchemaPropertyConfig = {
    [key: string]: SchemaPropertyConfigItem;
};
export declare type SchemaPropertyConfigItem = SchemaProperty & {
    messages?: {
        [key in keyof Omit<SchemaProperty, 'items'>]: string;
    };
};
export declare type SchemaPropertyKey = keyof SchemaProperty;
export declare type SchemaPropertyEnum = string | number;
export declare type SchemaProperty = {
    type: DataType;
    enum?: SchemaPropertyEnum[];
    pattern?: string;
    multipleOf?: number;
    items?: SchemaProperty | SchemaProperty[];
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
} & {
    [key in BestValueKey]?: number;
};
