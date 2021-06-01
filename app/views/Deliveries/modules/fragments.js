import { gql } from '@apollo/client';

export const DeliveryFragment = gql`
    fragment DeliveryFragment on Delivery {
        pk
        code
        weight
        length
        width
        height
        incoming_option_code
        delivery_type_code
        insurance_option_code
        shipment_type
        courier_id

        origin {
            name
            email
            phone
            street
            city
            state
            country {
                name
                code
                pk
            }
            lat
            lng
            post_code
        }
        destination {
            name
            email
            phone
            street
            city
            state
            country {
                name
                code
                pk
            }
            lat
            lng
            post_code
        }
        status {
            code
            name
        }
        insurance_option {
            code
            name
        }
        fee
        paid
        formatted_rate_code
        last_updated
        date_created
        current_awb
        last_tracking_update{
            description
            last_updated
        }
        courier {
            pk
            name
        }
        items {
            pk
            name
            weight
            amount
            item_type_code
            package_size_code
            description
            quantity
            value
        }
    }
`;

export const AddressFragment = gql`
    fragment AddressFragment on Address {
        pk
        user_id
        name
        street
        state
        city
        country {
            pk
            code
            name
        }
        lat
        lng
        email
        phone
        post_code
    }
`;

export const ImportFragment = gql`
    fragment ImportFragment on ImportDelivery {
        _id
        pk
        code
        profile_id
        franchise_id
        origin {
            name
            phone
            email
            street
            city
            post_code
            state
            country {
                name
                code
            }
        }
        delivery_option_code
        destination {
            name
            phone
            email
            street
            city
            post_code
            state
            country {
                name
                code
            }
        }
        from_address {
            name
            phone
            email
            street
            city
            post_code
            state
            country {
                name
                code
            }
        }
        total_value
        currency
        profile {
            _id
            pk
            name
            username
            email
            phone
            email_subscription
            authorization_header
            delivery_callback
            rc_number
            sms_subscription
            finance_callback
            type
            tin
        }
        merchant {
            name
            phone
            email
            user_id
        }
        label_image
        reference_number
        forwarding_id
        fee
        import_fee
        import_currency
        import_currency_fee
        exchange_rate_value
        service_charge
        delivery_fee
        import_payment_description
        dimension {
            length
            width
            height
        }
        source
        has_waybill_error
        weight
        volumetric_weight
        billable_weight
        status {
            code
            name
        }
        external_tracking_reference
        description
        payment_data {
            domain
            intent
            user_id
            reference_code
            action
            narration
            amount
            currency
            name
            phone
            email
            status_code
            type
        }
        date_created
        last_updated
    }
`;

export const ForwardingAddress = gql`
    fragment ForwardingAddress on ImportAddress {
        is_forwarding
        city
        country {
            code
            name
        }
        post_code
        street
        forwarding_id
        profile_id
        name
        state
        phone
        lng
        lat
        date_created
        last_updated
    }
`;

export const WarehouseFragment = gql`
    fragment WarehouseFragment on WarehouseAddress {
        zipcode
        name
        phone
        email
        franchise_id
        street
        city
        post_code
        state
        country {
            code
            name
        }
        is_franchise
        is_warehouse
        franchise_name
        code
        franchise_phone
        franchise_email
        lat
        lng
        old_id
        active
        _id
        pk
        forwarding_id
    }
`;
