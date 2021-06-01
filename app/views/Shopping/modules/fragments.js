import { gql } from '@apollo/client';

export const PostFragment = gql`
    fragment PostFragment on Post {
        name
        pk
        published
        visible
        date_created
        social_id
        social_url
        description
        regular_price
        price
        on_sale
        slug
        stock
        weight
        tags
        visible
        published
        interaction {
            bookmarked
            liked
            commented
            viewed
            reviewed
        }
        category {
            name
            description
            pk
            slug
        }
        custom_category {
            name
            description
            pk
            code
        }
        interaction {
            liked
            reviewed
            bookmarked
            commented
            viewed
        }
        page {
            name
            source {
                code
                name
            }
            pk
        }
        cover_image {
            url
            media_type
        }
        images {
            url
            media_type
        }
        profile {
            pk
            user_id
            username
            about
            name
            phone
            email
            profile_picture
            date_created
            store_name
            store_location {
                city
                state
                country {
                    name
                    code
                }
            }
        }
    }
`;
