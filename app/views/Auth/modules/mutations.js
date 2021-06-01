import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation loginUser($username: String!, $password: String!) {
        logIn(username: $username, password: $password) {
            token
            pk
            name
        }
    }
`;

export const PUSHID_REGISTRATION = gql`
    mutation registerPushId($app: String!, $app_id: ID!, $client: String) {
        registerPushId(app: $app, app_id: $app_id, client: $client) {
            pk
            name
            email
            auth_token
        }
    }
`;

export const REGISTER = gql`
    mutation signUp(
        $name: String!
        $email: String!
        $username: String!
        $phone: String!
        $password: String!
        $verify_password: String!
        $country_code: String!
        $account_type: String
    ) {
        signUp(
            name: $name
            email: $email
            username: $username
            phone: $phone
            password: $password
            verify_password: $verify_password
            country_code: $country_code
            account_type: $account_type
        ) {
            token
            pk
            name
            email
            phone
            ussd_code
        }
    }
`;

export const REQUEST_OTP = gql`
    mutation resendOtp($phone: String!, $country: String!) {
        resendOtp(phone: $phone, country_code: $country) {
            code
            name
            pk
            description
        }
    }
`;

export const VERIFY_PHONE = gql`
    mutation verifyPhone($code: String!) {
        verifyPhone(code: $code) {
            code
            name
            pk
            description
        }
    }
`;

export const RESET_PASSWORD = gql`
    mutation requestPassword($email: String!) {
        requestPassword(email: $email) {
            status
            message
        }
    }
`;

export const RESEND_OTP = gql`
    mutation resendOtp($phone: String!, $country: String!) {
        resendOtp(phone: $phone, country_code: $country) {
            code
            name
            pk
            description
        }
    }
`;

export const VERIFY_NUMBER = gql`
    mutation verifyPhone($code: String!) {
        verifyPhone(code: $code) {
            code
            name
            pk
            description
        }
    }
`;
