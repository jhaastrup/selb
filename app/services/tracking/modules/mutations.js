import { gql } from '@apollo/client';

export const TRACK_DELIVERY = gql`
    mutation getDeliveryTracking($code: String!) {
        tracking: getDeliveryTracking(code: $code) {
            code
            awb_no
            reference_code
            exception_message
            merchant_id
            event_type
            events {
                date_created
                description
                location_description
                status {
                    name
                    code
                }
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
        }
    }
`;
