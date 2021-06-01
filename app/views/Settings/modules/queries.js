import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
    query {
        me: me {
            pk
            username
            name
            default_address {
                name
                city
                state
                country {
                    code
                }
                pk
                post_code
            }
            default_entity {
                pk
                _id
                default
                name
                email
                phone
                description
                owner {
                    name
                    phone
                    username
                    website
                }
            }
            account_type {
                name
                pk
                description
                code
            }
            email
            phone
            paymentProfile {
                funds
                escrow
                accounts {
                    pk
                    type
                    balance
                    key
                    currency
                }
                virtual_bank_accounts {
                    account_name
                    account_number
                    bank_name
                }
            }
            discoveryProfile {
                pk
                is_seller
                username
                store_description
                about
                name
                profile_picture
                sales_volume
                followers_count
                following_count
                gender
                phone
                email
                profile_views
                profile_picture
                popularity
                store_url
                store_name
                store_banner
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

export const DEPENDENCIES = gql`
    query {
        me: me {
            pk
            name
            email
            phone
            username
        }
        dependencies: signupDependencies(
            countriesInput:{sort_by: {asc_desc: "asc" order_by: "name"} page_by: {per_page: "1000"}}
            statesInput:{sort_by: {asc_desc: "asc" order_by: "name"} page_by: {per_page: "1000"}}
            ) {
            states  {
                pk
                code
                name
                country_code
            }

            countries {
                pk
                code
                name
                phone_code
                requires_post_code
                is_shipment_origin
            }
            account_types {
                name
                code
            }
            ussd_code
        }
    }
`; 
