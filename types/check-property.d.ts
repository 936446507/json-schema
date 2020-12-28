import { Data } from './check-type';
import { ValidateResult, Json, SchemaPropertyConfig, SchemaPropertyConfigItem } from './interface';
declare function checkProperty(json: Json, properties: SchemaPropertyConfig): ValidateResult[];
declare function checkPropertyItem(key: string, value: Data, config: SchemaPropertyConfigItem): ValidateResult[];
export { checkPropertyItem };
export default checkProperty;
