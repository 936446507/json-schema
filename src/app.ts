import validates from './index';

const result = validates(
  {
    key: 1,
    key1: 1,
    key2: () => {},
  },
  {
    required: [
      {
        key: 'key3',
        message: 'message',
      },
    ],
    properties: {
      key: {
        type: 'String',
      },
    },
  }
);
console.log(result);
