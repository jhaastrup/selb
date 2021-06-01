import { gql } from '@apollo/client';

export const PROFILE = gql`
    query {
        me {
            pk
            username
            name
            email
            phone
            reviewProfile {
                referral_code
            }
            default_address {
                name
                user_id
                street
                state
                email
                city
                post_code
                phone
                country {
                    name
                }
            }
            paymentProfile {
                phone
                funds
                virtual_bank_accounts {
                    account_name
                    account_number
                    bank_name
                    pk
                }
            }
        }
    }
`;
