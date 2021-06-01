import { gql } from '@apollo/client';

export const FOREIGN_WAREHOUSES = gql`
    query getWarehouseAddresses(
        $sort_by: SortInput
        $page_by: PageByInput
        $filter_by: JSON
        $view: String
        $query: String
    ) {
        getWarehouseAddresses(sort_by: $sort_by, page_by: $page_by, filter_by: $filter_by, view: $view, query: $query) {
            zipcode
            name
            phone
            email
            franchise_id
            forwarding_id
            street
            city
            country {
                name
                code
            }
            post_code
            state
            is_franchise
            is_warehouse
            franchise_name
            code
            franchise_phone
            franchise_email
            pk
            import_fee
            import_description
            import_currency
            inc_weight
            delivery_timeline
        }
    }
`;

export const GET_IMPORT_ADDRESS = gql`
    query getImportAccount {
        getImportAccount {
            _id
            pk
            user_id
            forwarding_id
            forwarding_code
            default_address {
                is_forwarding
                city
                post_code
                street
                forwarding_id
                profile_id
                name
                email
                state
            }
            default_address_id
        }
    }
`;

export const GET_IMPORT_QUOTE = gql`
    query getQuoteForImport(
        $origin: QuoteAddressInput
        $destination: QuoteAddressInput
        $weight: Float
        $delivery_option_code: String
        $franchise_id: String
        $insurance_option_code: String
    ) {
        getQuoteForImport(
            origin: $origin
            destination: $destination
            weight: $weight
            delivery_option_code: $delivery_option_code
            franchise_id: $franchise_id
            insurance_option_code: $insurance_option_code
        ) {
            import_payment_description
            import_fee
            import_currency
            import_currency_fee
            fee
            destination {
                name
                pk
                phone
                street
                street
                email
                city
                post_code
                country {
                    name
                    code
                    pk
                }
            }
            origin {
                email
                name
                pk
                phone
                street
                street
                city
                post_code
                country {
                    name
                    code
                    pk
                }
            }
            delivery_fee
            weight
            exchange_rate_value
            service_charge
        }
    }
`;
