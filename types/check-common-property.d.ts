import { Data } from './check-type';
import { DataType, BestValueKey, ValidateResult, SchemaPropertyKey, SchemaPropertyEnum } from './interface';
declare function checkPropertyLimitType(key: string, property: SchemaPropertyKey, value: Data, limitTypes: DataType[]): ValidateResult | void;
declare function checkPropertyEnum(key: string, propertyEnum: SchemaPropertyEnum[], value: Data, message: string): ValidateResult[];
declare function checkBestValue(key: string, bestValueKey: BestValueKey, bestValue: number, value: number | string | any[], message: string): ValidateResult[];
export { checkPropertyLimitType, checkPropertyEnum, checkBestValue };
