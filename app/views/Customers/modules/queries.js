import { gql } from '@apollo/client';

export const MY_CUSTOMERS= gql`
    query discoveryMerchantCustomers($page_by: PageByInput, $sort_by: SortInput, $filter_by: PostFilter, $view: String, $query: String) {
        customers: discoveryMerchantCustomers(
            page_by: $page_by
            sort_by: $sort_by
            filter_by: $filter_by
            view: $view
            query: $query
        ){
            results{
                customer_id
                customer_name
                customer_email
                customer_phone
                trade_volume
                fulfilled_orders
                total_orders
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
