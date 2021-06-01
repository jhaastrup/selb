import gql from "graphql-tag";

export const GET_PROFILE = gql`
    query {
        me {
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
                funds_account{
                    balance
                    currency
                    key
                    type
                    name
                }
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

export const GET_CARTS = gql`
    query {
        me {
            username
            name
            email
            paymentProfile {
                funds
                accounts {
                    pk
                    type
                    balance
                    key
                    currency
                }
            }
            referral_code
        }
        getDiscoveryCarts {
            results {
                pk
                code
                total
                discount
                coupon_code
                merchant {
                    pk
                    name
                    email
                    store_name
                    store_location {
                        street
                        city
                        state
                        country {
                            pk
                            code
                            name
                        }
                    }
                }
                delivery_address {
                    name
                    street
                    state
                    email
                    city
                    country {
                        code
                        name
                    }
                    phone
                    post_code
                }
                items {
                    amount
                    quantity
                    post {
                        pk
                        on_sale
                        description
                        regular_price
                        name
                        images {
                            url
                            media_type
                        }
                        date_created
                        social_id
                        social_url
                    }
                }
                payment_data {
                    domain
                    reference_code
                    action
                    name
                    narration
                    amount
                    currency
                    phone
                    email
                    status_code
                    type
                }
            }
        }
    }
`;
