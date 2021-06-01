import { gql } from "@apollo/client";

export const SUBJECT_TYPE = gql`
  query getResolutionComplaintTypes(
    $sort_by: SortInput
    $page_by: PageByInput
    $filter_by: JSON
    $view: String
    $query: String
  ) {
    getResolutionComplaintTypes(
      sort_by: $sort_by
      page_by: $page_by
      filter_by: $filter_by
      view: $view
      query: $query
    ) {
      results {
        pk
        domain
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

export const DEPENDENCIES =gql`
    query {
        getResolutionComplaintTypes(sort_by: { asc_desc: "asc", order_by: "name" }, page_by: { per_page: "300" }) {
            metadata {
                sort_by {
                    asc_desc
                    order_by
                }
                page_by {
                    next_page
                    per_page
                    prev_page
                    page
                }
                filtering_options {
                    name
                    code
                }
                view
                query
            }
            results {
                pk
                domain
                name
                description
            }
        }
    }
`;
