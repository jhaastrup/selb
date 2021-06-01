import { gql } from '@apollo/client';

export const CREATE_ADDRESS = gql`
    mutation createAddress(
        $name: String
        $email: String
        $phone: String
        $street: String
        $street_line_2: String
        $city: String!
        $state: String!
        $country: String!
        $lat: Float
        $lng: Float
        $post_code: String
    ) {
        createAddress(
            name: $name
            email: $email
            phone: $phone
            street: $street
            street_line_2: $street_line_2
            city: $city
            state: $state
            country: $country
            lat: $lat
            lng: $lng
            post_code: $post_code
        ) {
            pk
            name
            name
            email
            phone
            street
            street_line_2
            city
            state
            country {
                name
                code
            }
            lat
            lng
            post_code
        }
    }
`;
