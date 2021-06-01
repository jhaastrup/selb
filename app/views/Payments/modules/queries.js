import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
    query {
        me: me {
            username
            name
            email
            social {
                name
                access_token
            }
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
                store_name
                username
                pk
                is_seller
            }
            referral_code
        }
    }
`;

export const PAYMENTS = gql`
    query payments($page_by: PageByInput, $sort_by: SortInput, $filter_by: CodeFilter, $query: String) {
        payments(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by) {
            results {
                pk
                profile {
                    _id
                    pk
                    username
                    name
                    email
                    phone
                }
                target {
                    pk
                    username
                    user_id
                    name
                    email
                    phone
                }
                sender {
                    pk
                    username
                    user_id
                    name
                    email
                    phone
                }
                account {
                    pk
                    balance
                    currency
                    key
                    type
                    name
                }
                sender_actions {
                    pk
                    code
                    name
                    description
                }
                status {
                    code
                    name
                    pk
                    description
                }
                code
                currency {
                    pk
                    payment_code
                    code
                    name
                    symbol
                }
                date_due
                transaction_date
                internal_status {
                    code
                    name
                    pk
                    description
                }
                disbursement_date
                transaction_date
                summary
                description
                narration
                amount
                date_created
                type
                reference_code
            }
            metadata {
                sort_by {
                    asc_desc
                    order_by
                }
                page_by {
                    next_page
                    per_page
                    prev_page
                    total
                    page
                    pages
                }
                filtering_options {
                    name
                    code
                    type
                }
                sorting_options {
                    name
                    code
                    type
                }
                view
                query
            }
        }
    }
`;

export const PAYMENT_DETAIL = gql`
    query payment($id: ID!) {
        payment(id: $id) {
            pk
            code
            summary
            amount
            date_created
            type
            sender {
                _id
                pk
                user_id
                name
                username
                email
                phone
                profile_id
            }
            target {
                pk
                user_id
                username
                name
                email
                profile_id
                value
                phone
            }
            narration
            reference_code
            description
            disbursement_date
            transaction_date
            account {
                pk
                balance
                currency
                key
                type
                name
            }
            sender_actions {
                pk
                code
                name
                description
            }
            recipient {
                _id
                pk
                username
                name
                email
                phone
                gender
            }
            status {
                code
                name
                pk
                description
                last_updated
            }
            escrow_reference
            currency {
                name
                symbol
                code
            }
            internal_status {
                code
                name
                description
            }
        }
    }
`;
