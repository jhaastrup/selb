import { gql } from '@apollo/client';

// import { ShipmentFragment } from './fragments';
import { DeliveryFragment, AddressFragment, ImportFragment } from './fragments';

export const DELIVERIES = gql`
    query deliveries($page_by: PageByInput, $sort_by: SortInput, $filter_by: JSON, $view: String $query: String) {
        deliveries(page_by: $page_by, sort_by: $sort_by, view: $view, query: $query, filter_by: $filter_by) {
            results {
                ...DeliveryFragment
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

    ${DeliveryFragment}
`;
export const DELIVERY_DEPENDENCIES = gql`
    query {
        me: me {
            pk
            username
            name
            email
            default_address {
                ...AddressFragment
            }
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
        dependencies: shippingDependencies(
            destinationCountry: { page_by: { per_page: "300" }, sort_by: { order_by: "name", asc_desc: "asc" } }
            itemType: { page_by: { per_page: "1000" } }
        ) {
            origin_countries {
                name
                code
                phone_code
                requires_post_code
                pk
            }
            destination_countries {
                name
                code
                phone_code
                pk
                requires_post_code
            }
            insurance_options {
                name
                code
                description
            }
            incoming_options {
                name
                code
                description
            }
            item_types {
                name
                code
                insurance
                category
                category_name
            }
            addresses {
                ...AddressFragment
            }
            drop_off_locations {
                ...AddressFragment
            }
        }

        paymentOptions: paymentDependencies(page_by: { page: "1", per_page: "100" }, view: "virtual") {
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

        states: states(
            filter_by: { country_code: { op: "$eq", value: "NG" } }
            page_by: { per_page: "100" }
            sort_by: { order_by: "name", asc_desc: "asc" }
        ) {
            results {
                name
                code
                country_code
                pk
            }
        }
    }

    ${AddressFragment}
`;

export const GET_STATES = gql`
    query GetStates($filter_by: StateFilterInput, $sort_by: SortInput, $page_by: PageByInput) {
        states(sort_by: $sort_by, page_by: $page_by, filter_by: $filter_by) {
            results {
                name
                code
                country_code
                pk
            }
        }
    }
`;

export const GET_DHL_CITIES = gql`
    query GetDHLCities($filter_by: StateFilterInput, $sort_by: SortInput, $page_by: PageByInput) {
        dhlCities(sort_by: $sort_by, page_by: $page_by, filter_by: $filter_by) {
            results {
                pk
                name
                country_code
                post_code
            }
        }
    }
`;

export const ADDRESSES = gql`
    query addresses($page_by: PageByInput, $sort_by: SortInput, $filter_by: AssetFilterInput) {
        addresses(page_by: $page_by, sort_by: $sort_by, filter_by: $filter_by) {
            results {
                pk
                name
                street
                state
                country {
                    pk
                    code
                    name
                    phone_code
                }
                email
                phone
                city
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
                view
                query
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
            }
        }
    }
`;

export const GET_DELIVERY_QUOTE = gql`
    query GetDeliveryQuote(
        $origin: QuoteAddressInput!
        $destination: QuoteAddressInput!
        $weight: Float!
        $length: Float
        $width: Float
        $height: Float
        $shipment_type: String
        $incoming_option_code: String
        $delivery_type_code: String
        $insurance_option_code: String
        $rate_key: String
        $coupon_code: String
    ) {
        getDeliveryQuote(
            origin: $origin
            destination: $destination
            weight: $weight
            length: $length
            width: $width
            height: $height
            shipment_type: $shipment_type
            incoming_option_code: $incoming_option_code
            delivery_type_code: $delivery_type_code
            insurance_option_code: $insurance_option_code
            rate_key: $rate_key
            coupon_code: $coupon_code
        ) {
            rates {
                name
                description
                fee
                key
                delivery_fee
                delivery_priority
                fee_without_pickup
                pickup_fee
            }
            fee
            amount
            total_value
            discount
            insurance_fee
            extended_insurance_fee
            rate_key
            weight
            total_value
            min_quoted_fee
            max_quoted_fee
            status {
                name
                code
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

export const DELIVERY = gql`
    query GetDelivery($id: ID!) {
        delivery(id: $id) {
            ...DeliveryFragment
        }
    }
    ${DeliveryFragment}
`;

export const IMPORTS = gql`
    query getImports($sort_by: SortInput, $page_by: PageByInput, $filter_by: JSON, $view: String, $query: String) {
        imports: getMerchantImports(
            sort_by: $sort_by
            page_by: $page_by
            filter_by: $filter_by
            view: $view
            query: $query
        ) {
            metadata {
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
                page_by {
                    next_page
                    prev_page
                    page
                    per_page
                    pages
                    total
                }
                #sort_by {
                #    order_by
                #    asc_desc
                #}
                view
                query
            }
            results {
                ...ImportFragment
            }
        }
    }
    ${ImportFragment}
`;

export const IMPORT = gql`
    query GetImportDelivery($id: ID!) {
        delivery: getMerchantImport(id: $id) {
            ...ImportFragment
        }
    }
    ${ImportFragment}
`;

export const IMPORT_DELIVERY_QUOTE = gql`
    query FetchImportQuote($id: ID!, $destination: AddressInput, $delivery_option_code: String) {
        delivery: fetchImportQuote(id: $id, destination: $destination, delivery_option_code: $delivery_option_code) {
            ...ImportFragment
        }
        dependencies: shippingDependencies {
            addresses {
                ...AddressFragment
            }
        }

        paymentOptions: paymentDependencies(page_by: { page: "1", per_page: "100" }, view: "virtual") {
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
    ${ImportFragment}
    ${AddressFragment}
`;

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
            default_entity {
                pk
                _id
                default
                name
                email
                phone
                description
                type
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
        }
    }
`;

export const CREATE_IMPORT_PAYMENT = gql`
    query fetchImportQuote($id: ID!, $destination: AddressInput, $delivery_option_code: String) {
        fetchImportQuote(id: $id, destination: $destination, delivery_option_code: $delivery_option_code) {
            ...ImportFragment
        }
    }

    ${ImportFragment}
`;
