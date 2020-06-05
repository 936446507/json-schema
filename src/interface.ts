import { Data, DataType } from './check-type';

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

export type SchemaPropertyEnum = string | number;
export type SchemaProperty = {
  type?: DataType;
  enum?: SchemaPropertyEnum[];
  minLength?: number;
  maxLength?: number;
  minNum?: number;
  maxNum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
};
