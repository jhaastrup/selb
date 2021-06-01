import { gql } from '@apollo/client';

export const MY_PICKUPS= gql`
    query getMerchantPickups($page_by: PageByInput, $sort_by: SortInput, $filter_by: JSON, $view: String, $query: String) {
        pickups: getMerchantPickups(
            page_by: $page_by
            sort_by: $sort_by
            filter_by: $filter_by
            view: $view
            query: $query
        ){
            results{
                pk
                _id                
                hub{
                    name
                    phone
                }
                code
                count
                status{
                    name
                    code
                }
                agent_id
                instruction
                origin{
                    phone
                    email
                    name
                    state
                    city
                    street
                    country{
                        name
                        code
                    }
                }
                agent{
                    pk
                    name
                    username
                    phone
                }
                courier_id
                courier{
                    name
                    username
                    phone
                    
                }
                courier_payment
                merchant_id
                merchant{
                    name
                    phone
                    email
                    username
                }
                merchant_user_id
                last_count
                base_fee
                extra_fee
                state
                country{
                    name
                    code
                }
                city
                connector_pickup_reference
                attempts{
                    status{
                        name
                        code

                    }
                }
                date_created
                last_updated
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
