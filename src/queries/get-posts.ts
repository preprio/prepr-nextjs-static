import { gql } from "@apollo/client";

export const GetPosts = gql`
    query GetPosts {
        Posts {
            items {
                _id
                _slug
                title
            }
        }
    }
`