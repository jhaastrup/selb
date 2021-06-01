import { gql } from '@apollo/client';
import { ApplicationFragment } from "./fragments";

export const EXTERNAL_APPLICATIONS = gql`
    query GetExternalApplications($sort_by: SortInput, $page_by: PageByInput, $filter_by: AssetFilterInput) {
        applications: getExternalApplications(sort_by: $sort_by, page_by: $page_by, filter_by: $filter_by){
            metadata {
                filter_by
                page_by {
                    page
                    total
                    pages
                    per_page
                    next_page
                    prev_page
                }
                sort_by {
                    asc_desc
                    order_by
                }
                sorting_options {
                    name
                    code
                    type
                }
                filtering_options {
                    name
                    code
                    type
                }
                query
                view
            }
            results{
                ...ApplicationFragment
            }
        }
    }
    ${ApplicationFragment}
`;

export const APPLICATION_DETAIL = gql`
    query GetApplicationDetail($id: ID!) {
        application: getExternalApplication(id: $id){
            ...ApplicationFragment
        }
    }
    ${ApplicationFragment}
`;
