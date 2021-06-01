import { gql } from '@apollo/client';

export const USERINFO = gql`
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

export const PAYMENT_DEPENDENCIES = gql`
    query GetDependencies {
        paymentDependencies(page_by: { page: "1", per_page: "100" }, view: "virtual") {
            cards {
                code
                name
                payment_source_code
                card_key
                bin
                last4
                brand
                mask
            }

            topup_options {
                code
                name
                payment_source_code
                card_key
            }

            account {
                code
                name
                payment_source_code
                card_key
                balance
            }

            profile {
                name
                funds
                username
                credits
                escrow
            }
        }
    }
`;

export const FIND_USER = gql`
    query findUser($value: String) {
        findUser(value: $value) {
            exists
            user {
                pk
                name
                email
                phone
                username
            }
        }
    }
`;

export const SENDBOX_USERS = gql`
    query getUsernames($page_by: PageByInput, $sort_by: SortInput, $filter_by: JSON) {
        getUsernames(page_by: $page_by, sort_by: $sort_by, filter_by: $filter_by) {
            results {
                pk
                value
                date_created
                user {
                    pk
                    name
                    username
                    email
                    phone
                }
            }
            metadata {
                page_by {
                    per_page
                    next_page
                    prev_page
                    page
                    pages
                    total
                }
            }
        }
    }
`;
