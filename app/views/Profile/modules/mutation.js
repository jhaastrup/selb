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
            status {
                pk
                code
                description
                name
                description
            }
        }
    }
`;

export const EMAIL_UPDATE = gql`
    mutation emailUpdate($id: ID, $code: String) {
        emailUpdate(id: $id, code: $code) {
            pk
            name
            email
            phone
        }
    }
`;

export const REQUEST_PHONE_UPDATE = gql`
    mutation requestPhoneUpdate($id: ID, $phone: String, $country_code: String) {
        requestPhoneUpdate(id: $id, phone: $phone, country_code: $country_code) {
            status {
                code
                description
                pk
            }
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
    mutation resetPassword($code: String!, $password: String!, $verify_password: String!) {
        resetPassword(code: $code, password: $password, verify_password: $verify_password) {
            status {
                code
                name
                pk
            }
        }
    }
`;
