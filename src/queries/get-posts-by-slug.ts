import { gql } from "@apollo/client";

export const GetPostBySlug = gql`
    query GetPost($slug: String) {
        Post (slug: $slug) {
            _id
            _slug
            title
            excerpt
            _read_time
            categories {
                name
                _slug
            }
            author {
                _id
                name
                image {
                    url(width: 64, height: 64)
                }
            }
            cover {
                url(width: 1500, height: 750)
            }
            content {
                __typename
                ... on Text {
                    _id
                    body
                    format
                    text
                }
                ... on Assets {
                    items {
                        _id
                        url(width: 1000)
                        mime_type
                        caption
                    }
                }
                ... on YouTubePost {
                    _id
                    url
                }
            }
        }
    }
`