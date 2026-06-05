const { ObjectId } = require('mongodb');

function assertObjectId(value, fieldName = 'id') {
  if (value instanceof ObjectId) {
    return value;
  }

  if (typeof value !== 'string' || value.trim() === '' || !ObjectId.isValid(value)) {
    throw new Error(`Campo "${fieldName}" e invalido`);
  }

  return new ObjectId(value);
}

module.exports = {
  assertObjectId
};
