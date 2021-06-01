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
        $set_as_default: Boolean
    ) {
        createAddress(
            name: $name
            street: $street
            city: $city
            state: $state
            country: $country
            set_as_default: $set_as_default
            email: $email
            phone: $phone
        ) {
            pk
            name
            street
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

export const SETUP_USERNAME = gql`
    mutation usernameUpdate($id: ID, $username: String) {
        usernameUpdate(id: $id, username: $username) {
            pk
        }
    }
`;

export const REGISTER_BUSINESS = gql`
    mutation registerEntity($name: String!, $email: String, $phone: String!, $type: String!, $description: String) {
        registerEntity(name: $name, email: $email, phone: $phone, type: $type, description: $description) {
            pk
            name
            email
            phone
            type
        }
    }
`;
