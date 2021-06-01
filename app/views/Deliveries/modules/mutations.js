import { gql } from '@apollo/client';

import { DeliveryFragment, ImportFragment } from './fragments';

export const CREATE_DELIVERY = gql`
    mutation CreateDelivery(
        $origin: ShipmentAddressInput!
        $destination: ShipmentAddressInput!
        $items: [ItemInput]
        $weight: Float!
        $length: Float
        $width: Float
        $height: Float
        $shipment_type: String
        $incoming_option_code: String
        $delivery_type_code: String
        $insurance_option_code: String
        $rate_key: String
        $coupon_code: String
    ) {
        createDelivery(
            origin: $origin
            destination: $destination
            items: $items
            weight: $weight
            length: $length
            width: $width
            height: $height
            shipment_type: $shipment_type
            incoming_option_code: $incoming_option_code
            delivery_type_code: $delivery_type_code
            insurance_option_code: $insurance_option_code
            rate_key: $rate_key
            coupon_code: $coupon_code
        ) {
            pk
            code
            status {
                name
                code
            }
            payment_data {
                name
                email
                phone
                status_code
                type
                currency
                amount
                action
                narration
                domain
                reference_code
            }
        }
    }
`;

export const VERIFY_DELIVERY_PAYMENT = gql`
    mutation verifyDeliveryTransaction($txref: String) {
        verifyDeliveryTransaction(txref: $txref) {
            code
            status {
                name
                code
            }
            shipment {
                ...DeliveryFragment
            }
        }
    }
    ${DeliveryFragment}
`;

export const VERIFY_IMPORT_TRANSACTION = gql`
    mutation verifyImportTransaction($txref: String) {
        verifyImportTransaction(txref: $txref) {
            code
            status {
                name
                code
            }
            import_data {
                ...ImportFragment
            }
        }
    }
    ${ImportFragment}
`;

export const DOWNLOAD_RECEIPT = gql`
    mutation sendDeliveryReceipt($id: ID, $code: String) {
        sendDeliveryReceipt(id: $id, code: $code) {
            pk
            code
            batch_id
            reference_code
        }
    }
`;

export const VERIFY_DELIVERY_COUPON = gql`
    mutation validateDeliveryCoupon($code: String) {
        validateDeliveryCoupon(code: $code) {
            code
            valid
        }
    }
`;
