const { assertObjectId } = require('../utils/objectId');

function validateObjectIdParam(paramName) {
  return (req, res, next) => {
    try {
      assertObjectId(req.params[paramName], paramName);
      return next();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
}

function validateObjectIdBody(fieldName) {
  return (req, res, next) => {
    try {
      if (!req.body || req.body[fieldName] === undefined || req.body[fieldName] === null || req.body[fieldName] === '') {
        return res.status(400).json({ error: `Campo "${fieldName}" e obrigatorio` });
      }

      assertObjectId(req.body[fieldName], fieldName);
      return next();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
}

module.exports = {
  validateObjectIdParam,
  validateObjectIdBody
};
