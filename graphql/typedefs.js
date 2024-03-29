const {gql} = require('apollo-server')

module.exports = gql`
    type User{
        _id: ID!
        username: String!
        email: String!
        password: String!
        mobile: String!
        token: String!
        createdAt: String!
        userStatus: String!
        otpToken: String!
        otpTokenExpire: String!
        resetPasswordToken: String!
        resetPasswordExpire: String!
    }

    input input{
        username: String!
        email: String!
        password: String!
        cpassword: String!
        mobile: String!
    }

    type Query{
        getInfo(email: String!): User
    }

    type Mutation{
        register(input: input): User
        login(email: String!, password: String!): User
        verifyUser(email: String!, otpToken: String!): User
        forgotPassword(email: String!): User
        resetPassword(resetToken: String!, email: String!, password: String!, cpassword: String!): User
    }
`
