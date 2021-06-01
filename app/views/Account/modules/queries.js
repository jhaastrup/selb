import { gql } from '@apollo/client';
import { OrderFragment, BillingFragment, TopupsFragment, RequestFragment } from './fragments';

export const GET_PROFILE = gql`
    query {
        kyc: kycCheck {
            bvn_validated
            daily_withdrawal_limit
            monthly_withdrawal_limit
        }
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

export const WALLET_DEPENDENCIES = gql`
    query {
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
        kyc: kycCheck {
            bvn_validated
            daily_withdrawal_limit
            monthly_withdrawal_limit
        }
        dependencies: paymentDependencies(page_by: { page: "1", per_page: "100" }) {
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
                description
                card_key
            }
            account {
                code
                name
                payment_source_code
                description
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
        banks: banks(sort_by: { asc_desc: "asc" }, page_by: { per_page: "300" }) {
            results {
                code
                name
                description
                bank_transfer
                ussd
                pk
                pay_with_bank
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
                    page
                }
                filtering_options {
                    name
                    code
                }
                view
                query
            }
        }
    }
`;

export const WITHDRAW_DEPENDENCIES = gql`
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
            }
            discoveryProfile {
                store_name
                username
                pk
                is_seller
            }
            referral_code
        }
        banks: bankAccounts {
            results {
                pk
                account_number
                account_name
                bank {
                    name
                    code
                }
            }
        }
        kyc: kycCheck {
            bvn_validated
            daily_withdrawal_limit
            monthly_withdrawal_limit
        }
    }
`;

export const VERIFY_TOPUP = gql`
    query VerifyTopup($amount: Float!, $currency: String!, $payment_source_code: String, $card_key: String) {
        verifyTopUpDetail(
            amount: $amount
            currency: $currency
            payment_source_code: $payment_source_code
            card_key: $card_key
        ) {
            amount
            fee
            payable
            payment_source_code
            currency
        }
    }
`;

export const FIND_USER = gql`
    query FindUser($value: String) {
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
        findUser(value: $value) {
            user {
                pk
                name
                email
                phone
            }
            exists
        }
    }
`;

export const FETCH_BILLING_LIST = gql`
    query billingServiceGroups($page_by: PageByInput, $sort_by: SortInput, $filter_by: BillingFilter, $query: String) {
        billingServiceGroups(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by) {
            results {
                pk
                code
                name
                description
                category {
                    pk
                    name
                    description
                    has_groups
                }
            }
        }
    }
`;

export const FETCH_BILLING_INFO = gql`
    query billingServices($page_by: PageByInput, $sort_by: SortInput, $filter_by: BillingFilter, $query: String) {
        billingServices(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by) {
            results {
                pk
                is_fixed_amount
                name
                code
                amount
                group {
                    pk
                    code
                    name
                    description
                    category {
                        pk
                        name
                        description
                        has_groups
                    }
                }
                pk
            }
        }
    }
`;

export const VERIFY_CUSTOMER = gql`
    query verifyBillingCustomer($amount: Float!, $payment_code: String!, $customer_ref: String!) {
        verifyBillingCustomer(amount: $amount, payment_code: $payment_code, customer_ref: $customer_ref) {
            status
            message
            customer_name
            customer_info
            amount
            service_charge
            customer_ref
            total_amount
            payment_sourc_code
        }
    }
`;

export const VERIFY_BILLING_PAYMENT_SUCCESS = gql`
    query billingPayment($id: ID!) {
        billingPayment(id: $id) {
            pk
            _id
            pin
            biller
            code
            user_id
            amount
            customer_id
            status
            payment_code
            transaction_ref
            biller_status
            customer_details {
                phone
                name
                email
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
                    name
                    pk
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

export const BILLING_DEPENDENCIES = gql`
    query {
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
        dependencies: paymentDependencies(page_by: { page: "1", per_page: "100" }) {
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
                description
                card_key
            }
            account {
                code
                name
                payment_source_code
                description
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
        billingServices: billingServices(
            sort_by: { asc_desc: "asc" }
            page_by: { per_page: "300" }
            filter_by: { category: { op: "$in", value: ["airtime", "electricity"] } }
        ) {
            results {
                pk
                name
                code
                category {
                    name
                    pk
                    has_groups
                }
                group {
                    name
                    pk
                }
                is_fixed_amount
                amount
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
                    page
                }
                filtering_options {
                    name
                    code
                }
                view
                query
            }
        }
    }
`;

export const GET_TRANSACTIONS = gql`
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
