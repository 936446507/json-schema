import { DataType, ValidateResult, SchemaPropertyConfigItem } from './interface';
declare function checkPropertyUniqueItems(key: string, uniqueItems: boolean, value: DataType[], message?: string): ValidateResult[];
declare function checkPropertyItems(key: string, itemConfigs: SchemaPropertyConfigItem | SchemaPropertyConfigItem[], arr: DataType[]): ValidateResult[];
export { checkPropertyUniqueItems, checkPropertyItems };
