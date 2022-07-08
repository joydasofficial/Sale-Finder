import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation($input: input){
    register(input: $input) {
    _id
    username
    email
    token
    createdAt
  }
}`

export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!){
    login(email: $email, password: $password) {
    token
    userStatus
    }
  }
`

export const VERIFY_USER = gql`
  mutation($email: String!, $otpToken: String!){
    verifyUser(email: $email, otpToken: $otpToken) {
      userStatus
    }
  }
`

export const FORGOT_PASSWORD = gql`
  mutation($email: String!){
    forgotPassword(email: $email) {
      email
    }
  }
`
export const RESET_PASSWORD = gql`
  mutation($resetToken: String!, $email: String!, $password: String!, $cpassword: String!){
    resetPassword(resetToken: $resetToken, email: $email, password: $password, cpassword: $cpassword) {
      email
    }
  }
`
