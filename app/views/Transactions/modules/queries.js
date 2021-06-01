import { gql } from '@apollo/client';

export const TRANSACTIONS = gql`
    query transactions($page_by: PageByInput, $sort_by: SortInput, $filter_by: JSON, $query: String) {
        transactions(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by) {
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

export const TRANSACTION_DETAIL = gql`
    query transaction($id: ID) {
        transaction(id: $id) {
            code
            pk
            domain
            commission
            source
            amount
            payment_source_code
            message
            type
            data {
                order_reference
                amount
                txref
            }
            page
            txref
            profile {
                username
                name
                phone
                email
                funds
                bvn
                credits
            }
            name
            email
            phone
            reference_code
            narration
            transactionreference
            date_created
            status {
                code
                name
            }
            current_balance
            previous_balance
        }
    }
`;
