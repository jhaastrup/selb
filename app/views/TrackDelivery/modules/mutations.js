import { gql } from "@apollo/client";

export const TRACK_SHIPMENT = gql`
  mutation getDeliveryTracking($code: String!) {
    getDeliveryTracking(code: $code) {
      code
      events {
        date_created
        description
        location_description
        status {
          name
          code
        }
      }
      courier {
        pk
        courier_id
        name
        username
      }
      origin {
        name
        state
        street
        email
        city
        country {
          name
        }
        phone
      }
      destination {
        name
        state
        street
        email
        city
        country {
          name
        }
        phone
      }
      status {
        code
        name
        description
        pk
      }
    }
  }
`;
