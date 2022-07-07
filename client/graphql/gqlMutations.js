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

