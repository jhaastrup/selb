import { gql } from '@apollo/client';
import { OrderFragment, BillingFragment, TopupsFragment, RequestFragment } from './fragments';

export const GET_PROFILE = gql`
    query {
        transactions: transactions(page_by: { per_page: "3" }) {
            results {
                code
                pk
                domain
                commission
                amount
                payment_source_code
                message
                type
                page
                txref
                name
                email
                phone
                reference_code
                narration
                action
                transactionreference
                date_created
                account {
                    pk
                    balance
                    currency
                    key
                    type
                    name
                }
                status {
                    code
                    name
                    pk
                    date_created
                    description
                }
                source
                data {
                    order_reference
                    amount
                    txref
                }
                current_balance
            }
        }

        me: me {
            pk
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
                credits
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
        payment: payment(id: $id) {
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
        me: me {
            pk
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
                credits
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
export const DISCOVERY_ORDERS = gql`
    query getDiscoveryOrders(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: CodeFilter
        $query: String
        $view: String
    ) {
        getDiscoveryOrders(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by, view: $view) {
            results {
                ...OrderFragment
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
    ${OrderFragment}
`;

export const DISCOVERY_ORDER = gql`
    query getDiscoveryOrder($id: ID!) {
        getDiscoveryOrder(id: $id) {
            ...OrderFragment
        }
    }
    ${OrderFragment}
`;

export const UTILITY_HISTORY = gql`
    query billingPayments(
        $sort_by: SortInput
        $page_by: PageByInput
        $filter_by: BillingFilter
        $view: String
        $query: String
    ) {
        billingPayments(sort_by: $sort_by, page_by: $page_by, filter_by: $filter_by, view: $view, query: $query) {
            results {
                ...BillingFragment
            }
            metadata {
                page_by {
                    next_page
                    per_page
                    prev_page
                    total
                    page
                    pages
                }
                view
                query
            }
        }
    }
    ${BillingFragment}
`;

export const UTILITY_DETAIL = gql`
    query billingPayment($id: ID!) {
        billingPayment(id: $id) {
            ...BillingFragment
        }
    }
    ${BillingFragment}
`;

export const WITHDRAWALS = gql`
    query getWithdrawals($sort_by: SortInput, $page_by: PageByInput, $filter_by: JSON, $view: String, $query: String) {
        getWithdrawals(sort_by: $sort_by, page_by: $page_by, filter_by: $filter_by, view: $view, query: $query) {
            results {
                pk
                status {
                    code
                    name
                    description
                }
                name
                requires_manual_approval
                email
                phone
                bank_account {
                    bank {
                        code
                        description
                        name
                    }
                    account_name
                    account_number
                }
                transaction_code
                code
                comment
                amount
                date_created
                manually_approved
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

export const TOPUPS = gql`
    query getTopUps($page_by: PageByInput, $sort_by: SortInput, $filter_by: JSON, $query: String) {
        getTopUps(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by) {
            results {
                ...TopupsFragment
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
    ${TopupsFragment}
`;

export const TOPUP_DETAIL = gql`
    query getTopUp($id: ID!) {
        getTopUp(id: $id) {
            ...TopupsFragment
        }
    }
    ${TopupsFragment}
`;

export const REQUESTS = gql`
    query getRequest($page_by: PageByInput, $sort_by: SortInput, $filter_by: CodeFilter, $query: String) {
        requests:requests(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by) {
            results {
                ...RequestFragment
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
    ${RequestFragment}
`;

export const REQUEST_DETAIL = gql`
    query request($id: ID!) {
        request:request(id: $id) {
            ...RequestFragment
        }
        me: me {
            pk
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
                credits
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
    ${RequestFragment}
`;
