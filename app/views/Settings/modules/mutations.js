import { gql } from '@apollo/client';

export const UPDATE_USERNAME = gql`
    mutation usernameUpdate($id: ID, $username: String) {
        usernameUpdate(id: $id, username: $username) {
            pk
            name
            email
            phone
            username
        }
    }
`;

export const UPDATE_NAME = gql`
    mutation nameUpdate($id: ID, $name: String) {
        nameUpdate(id: $id, name: $name) {
            pk
            name
            email
            phone
            username
        }
    }
`;

export const REQUEST_EMAIL_UPDATE = gql`
    mutation requestEmailUpdate($id: ID, $email: String) {
        requestEmailUpdate(id: $id, email: $email) {
            status
            message
        }
    }
`;

export const REQUEST_PHONE_UPDATE = gql`
    mutation requestPhoneUpdate($id: ID, $phone: String, $country_code: String) {
        requestPhoneUpdate(id: $id, phone: $phone, country_code: $country_code) {
            status
        }
    }
`;

export const PHONE_UPDATE = gql`
    mutation phoneUpdate($id: ID, $code: String) {
        phoneUpdate(id: $id, code: $code) {
            pk
            phone
            email
        }
    }
`;

export const RESET_PASSWORD = gql`
    mutation passwordReset($id: String!, $old_password: String!, $new_password: String!, $verify_password: String!) {
        passwordReset(
            id: $id
            old_password: $old_password
            new_password: $new_password
            verify_password: $verify_password
        ) {
            pk
            name
            email
            username
        }
    }
`;
