import { gql } from '@apollo/client';

export const CARDS = gql`
    query cards($page_by: PageByInput, $sort_by: SortInput, $filter_by: CodeFilter, $query: String) {
        cards(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by) {
            results {
                pk
                bin
                last4
                key
                expiry_year
                expiry_month
                brand
                mask
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
