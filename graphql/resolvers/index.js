const userResolver = require('./User')

module.exports = {
    Query: {
        ...userResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation
    }
}