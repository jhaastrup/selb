import { gql } from '@apollo/client';

// import { ShipmentFragment } from './fragments';
import { AddressFragment } from './fragments';

export const DELIVERY_DEPENDENCIES = gql`
    query {
        me: me {
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
            }
            item_types {
                name
                code
            }
            addresses {
                ...AddressFragment
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
    query GetDHLCities($start: String, $max: String, $queryBy: String, $cntryCd: String, $cityNmStart: String) {
        getDhlCities(start: $start, max: $max, queryBy: $queryBy, cntryCd: $cntryCd, cityNmStart: $cityNmStart) {
            results {
                pk
                name
                country_code
                post_code
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
            discount
            insurance_fee
            rate_key
            min_quoted_fee
            max_quoted_fee
            status {
                name
                code
            }
        }
    }
`;

export const GET_IMPORT_QUOTE = gql`
    query GetImportQuote(
        $origin: QuoteAddressInput!
        $destination: QuoteAddressInput!
        $weight: Float!
        $delivery_option_code: String
    ) {
        getQuoteForImport(
            origin: $origin
            destination: $destination
            weight: $weight
            delivery_option_code: $delivery_option_code
        ) {
            import_payment_description
            import_fee
            delivery_option_code
            import_currency_fee
            import_currency
            profile_id
            fee

            delivery_fee
            weight
            exchange_rate_value
            service_charge
        }
    }
`;
