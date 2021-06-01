import { gql } from '@apollo/client';

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
