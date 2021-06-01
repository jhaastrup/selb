import { gql } from '@apollo/client';

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

export const COUNTRY_DEPENDENCIES = gql`
    query {
        countries(sort_by: { asc_desc: "asc" }, page_by: { per_page: "193" }) {
            results {
                pk
                code
                name
                requires_post_code
            }
        }
    }
`;

export const GET_STATES = gql`
    query getStates($filter_by: StateFilterInput!, $page_by: PageByInput) {
        states(filter_by: $filter_by, page_by: $page_by) {
            results {
                pk
                code
                name
            }
        }
    }
`;

export const DEPENDENCIES = gql`
    query {
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
        }
        userProfile: me {
            pk
            username
            name
            email
            phone
            account_type {
                name
                pk
                description
                code
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
