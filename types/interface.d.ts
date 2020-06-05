import { Data, DataType } from './check-type';
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
        [key in keyof SchemaProperty]: string;
    };
};
export declare type SchemaPropertyEnum = string | number;
export declare type SchemaProperty = {
    type?: DataType;
    enum?: SchemaPropertyEnum[];
    minLength?: number;
    maxLength?: number;
    minNum?: number;
    maxNum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
};
