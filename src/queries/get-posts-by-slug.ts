import { gql } from "@apollo/client";

export const GetPostBySlug = gql`
    query GetPost($slug: String) {
        Post (slug: $slug) {
            _id
            title
            cover {
                url(width: 1500, height: 1250)
            }
            content {
                __typename
                ... on Text {
                    _id
                    body
                    text
                }
                ... on Assets {
                    items {
                        _id
                        url(width: 300, height: 250)
                    }
                }
            }
        }
    }
`