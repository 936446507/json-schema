import { Data } from './check-type';

export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'object'
  | 'array';
export type BestValueKey = 'minLength' | 'maxLength' | 'minNum' | 'maxNum';
export type ValidateResult = { key: string; message: string };

export type Json = {
  [key: string]: Data;
};
export type Schema = {
  required?: SchemaRequired;
  properties?: SchemaPropertyConfig;
};

export type SchemaRequired = (string | { key: string; message: string })[];
export type SchemaPropertyConfig = {
  [key: string]: SchemaPropertyConfigItem;
};
export type SchemaPropertyConfigItem = SchemaProperty & {
  messages?: {
    [key in keyof SchemaProperty]: string;
  };
};

export type SchemaPropertyKey = keyof SchemaProperty;
export type SchemaPropertyEnum = string | number;
export type SchemaProperty = {
  type?: DataType;
  enum?: SchemaPropertyEnum[];
} & {
  [key in BestValueKey]?: number;
};
