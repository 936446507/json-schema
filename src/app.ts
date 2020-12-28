import { Schema } from './interface';
import validates from './index';

const json = {
  key: 'ddd',
  key1: 1,
  key2: 1,
  key3: 10,
  key4: 11,
  key5: 'ssssfdsafs',
  key6: [1, 1, 1, 2],
};
const schema: Schema = {
  required: [
    {
      key: 'key3',
      message: 'message',
    },
  ],
  properties: {
    key: {
      type: 'string',
      minLength: 10,
    },
    key2: {
      type: 'number',
      enum: [1, 2],
    },
    key3: {
      type: 'number',
      exclusiveMinNum: 10,
      maxNum: 20,
    },
    key4: {
      type: 'number',
      multipleOf: 10,
    },
    key5: {
      type: 'string',
      pattern: 'ss+',
    },
    key6: {
      type: 'array',
      uniqueItems: true,
      minItems: 5,
      maxItems: 6,
      items: { type: 'string' },
    },
  },
};

const result = validates(json, schema);
console.log(result);
