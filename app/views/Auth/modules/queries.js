import { gql } from '@apollo/client';
export const PROFILE = gql`
    query me {
        me {
            pk
            username
            name
            email
            phone
            discoveryProfile {
                pk
                connected_stores {
                    key
                    source {
                        code
                        name
                    }
                    url
                    name
                    user_id
                }
            }
            reviewProfile {
                referral_code
            }
            website
            social {
                profile_id
                username
                name
                code
                access_token
                social_id
                username
                phone
            }
            gender
            photo
            date_of_birth
            referral_code
            registration_location
            bvn
            bvnValidated
        }
    }
`;

export const CHECK_FOR_ACCOUNT = gql`
    query findUser($phone: String) {
        findUser(phone: $phone) {
            user {
                pk
                name
                email
                phone
                username
            }
            exists
        }
    }
`;

export const COUNTRIES = gql`
    query {
        countries(page_by: { per_page: "300" }, sort_by: { order_by: "name", asc_desc: "asc" }) {
            results {
                pk
                code
                name
                phone_code
                enabled
            }
        }
    }
`;

export const CHECK_VERIFICATION = gql`
    query checkVerification($value: String) {
        checkVerification(value: $value) {
            pk
            status {
                name
                code
                description
            }
            target
            is_used
            action
            expires_in
        }
    }
`;

export const REQUEST_OTP = gql`
    query requestPhoneOtp($phone: String, $country_code: String) {
        requestPhoneOtp(phone: $phone, country_code: $country_code) {
            message
            reset_id
            ussd_code
            status
        }
    }
`;

export const SIGNUP_DEPENDENCIES = gql`
    query signupDependencies(
        $countriesInput: CountryInput
        $statesInput: StateInput
        $accountTypeInput: AccountTypeInput
    ) {
        signupDependencies(
            countriesInput: $countriesInput
            statesInput: $statesInput
            accountTypeInput: $accountTypeInput
        ) {
            states {
                pk
                code
                name
                country_code
            }

            countries {
                pk
                code
                name
                requires_post_code
                is_shipment_origin
            }
            account_types {
                name
                code
            }
        }
    }
`;
