import { gql } from '@apollo/client';
import { ResolutionFragment } from './fragments';

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
                name
                description
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
        me{
            name
            email
        }
    }
`;

export const GET_RESOLUTION_THREADS = gql`
    query getResolutionThreads(
        $sort_by: SortInput
        $page_by: PageByInput
        $filter_by: JSON
        $view: String
        $query: String
    ) {
        getResolutionThreads(sort_by: $sort_by, page_by: $page_by, filter_by: $filter_by, view: $view, query: $query) {
            results {
                ...ResolutionFragment
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
            custom_params {
                open_threads
                closed_threads
            }
        }
    }
    ${ResolutionFragment}
`;

export const GET_THREAD = gql`
    query getResolutionThread($id: ID!) {
        getResolutionThread(id: $id) {
            ...ResolutionFragment
        }
    }
    ${ResolutionFragment}
`;
