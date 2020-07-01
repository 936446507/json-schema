import validates from './index';
const json = {
    key: 1,
    key1: 1,
    key2: 1,
    key3: 5,
};
const schema = {
    required: [
        {
            key: 'key3',
            message: 'message',
        },
    ],
    properties: {
        key: {
            type: 'string',
        },
        key2: {
            type: 'number',
            enum: [1, 2],
        },
        key3: {
            type: 'number',
            minNum: 10,
            maxNum: 20,
        },
    },
};
const result = validates(json, schema);
console.log(result);
