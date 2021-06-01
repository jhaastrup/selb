import { gql } from '@apollo/client';

export const DeliveryFragment = gql`
    fragment DeliveryFragment on Delivery {
        pk
        code
        origin {
            name
            email
            phone
            street
            city
            state
            country {
                name
                code
                pk
            }
            lat
            lng
            post_code
        }
        destination {
            name
            email
            phone
            street
            city
            state
            country {
                name
                code
                pk
            }
            lat
            lng
            post_code
        }
        status {
            code
            name
        }
        fee
        paid
        formatted_rate_code
        last_updated
        date_created
        items {
            pk
            name
            weight
            amount
            item_type_code
            package_size_code
            description
            quantity
            value
        }
    }
`;

export const AddressFragment = gql`
    fragment AddressFragment on Address {
        pk
        user_id
        name
        street
        state
        city
        country {
            pk
            code
            name
        }
        lat
        lng
        email
        phone
        post_code
    }
`;
