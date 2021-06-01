import { gql } from '@apollo/client';

export const CREATE_ADDRESS = gql`
    mutation createAddress(
        $name: String
        $street: String
        $city: String!
        $state: String!
        $country: String!
        $email: String
        $phone: String
    ) {
        createAddress(
            name: $name
            street: $street
            city: $city
            state: $state
            country: $country

            email: $email
            phone: $phone
        ) {
            pk
            name
            street
            state
            country {
                pk
                code
                name
                phone_code
            }
            email
            phone
            city
        }
    }
`;

export const DELETE_ADDRESS = gql`
    mutation deleteAddress($id: ID!) {
        deleteAddress(id: $id) {
            title
            description
        }
    }
`;

export const SET_DEFAULT_ADDRESS = gql`
    mutation setDefaultAddress($id: ID) {
        setDefaultAddress(id: $id) {
            pk
            id
            name
            street
        }
    }
`;
