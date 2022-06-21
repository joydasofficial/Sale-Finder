const userResolver = require('./User')

module.exports = {
    Mutation: {
        ...userResolver.Mutation
    }
}