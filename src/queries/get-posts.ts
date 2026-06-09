import { gql } from "@apollo/client";

export const GetPosts = gql`
    query GetPosts($limit: Int) {
        Posts(limit: $limit, sort: publish_on_DESC) {
            items {
                _id
                _slug
                title
                excerpt
                _read_time
                categories {
                    name
                    _slug
                }
                cover {
                    url(width: 720, height: 360)
                }
                author {
                    _id
                    name
                    image {
                        url(width: 64, height: 64)
                    }
                }
            }
        }
    }
`