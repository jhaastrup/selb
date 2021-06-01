import { gql } from "@apollo/client";
import { OrderFragment, BillingFragment } from "./fragments";

export const DISCOVERY_ORDERS = gql`
  query getDiscoveryOrders(
    $page_by: PageByInput
    $sort_by: SortInput
    $filter_by: CodeFilter
    $query: String
    $view: String
  ) {
    getDiscoveryOrders(
      page_by: $page_by
      sort_by: $sort_by
      query: $query
      filter_by: $filter_by
      view: $view
    ) {
      results {
        ...OrderFragment
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
  ${OrderFragment}
`;

export const DISCOVERY_ORDER = gql`
  query getDiscoveryOrder($id: ID!) {
    getDiscoveryOrder(id: $id) {
      ...OrderFragment
    }
  }
  ${OrderFragment}
`;

export const UTILITY_HISTORY = gql`
  query billingPayments(
    $sort_by: SortInput
    $page_by: PageByInput
    $filter_by: BillingFilter
    $view: String
    $query: String
  ) {
    billingPayments(
      sort_by: $sort_by
      page_by: $page_by
      filter_by: $filter_by
      view: $view
      query: $query
    ) {
      results {
        ...BillingFragment
      }
      metadata {
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
      }
    }
  }
  ${BillingFragment}
`;

export const UTILITY_DETAIL = gql`
  query billingPayment($id: ID!) {
    billingPayment(id: $id) {
      ...BillingFragment
    }
  }
  ${BillingFragment}
`;
