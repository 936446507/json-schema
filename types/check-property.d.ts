import { Data } from './check-type';
import { DataType, BestValueKey, ValidateResult, Json, SchemaPropertyConfig, SchemaPropertyConfigItem, SchemaPropertyEnum } from './interface';
declare function checkProperty(json: Json, properties: SchemaPropertyConfig): ValidateResult[];
declare function checkPropertyItem(key: string, value: Data, config: SchemaPropertyConfigItem): ValidateResult[];
declare function checkPropertyType(key: string, type: DataType, value: Data, message: string): ValidateResult[];
declare function checkPropertyEnum(key: string, propertyEnum: SchemaPropertyEnum[], value: Data, message: string): ValidateResult[];
declare function checkBestValue(key: string, bestValueKey: BestValueKey, bestValue: number, value: Number, message: string): ValidateResult[];
export { checkProperty, checkPropertyItem, checkPropertyType, checkPropertyEnum, checkBestValue, };
export default checkProperty;
