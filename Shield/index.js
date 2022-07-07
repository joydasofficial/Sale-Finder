const { shield } = require('graphql-shield');

const isAuthorized = require('../middleware/isAuthorized');
const permissions = shield({
  Query: {},
  Mutation: {
    verifyUser: isAuthorized,
  },
});

module.exports = permissions;