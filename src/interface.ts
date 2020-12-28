import { Data } from './check-type';

export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'object'
  | 'array';
export type BestValueKey =
  | 'minLength'
  | 'maxLength'
  | 'minNum'
  | 'maxNum'
  | 'exclusiveMinNum'
  | 'exclusiveMaxNum'
  | 'minItems'
  | 'maxItems';
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
    [key in keyof Omit<SchemaProperty, 'items'>]: string;
  };
};

export type SchemaPropertyKey = keyof SchemaProperty;
export type SchemaPropertyEnum = string | number;
export type SchemaProperty = {
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
