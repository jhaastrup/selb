import { gql } from '@apollo/client';

export const MerchantPostFragment = gql`
    fragment MerchantPostFragment on Post {
        pk
        code
        name
        slug
        stock
        status {
            name
            description
        }
        weight
        height
        width
        length
        order_count
        units_sold
        on_sale
        price
        regular_price
        description
        cover_image {
            pk
            id
            name
            url
            media_type
            date_created
            source {
                code
                name
            }
        }
        images {
            pk
            id
            name
            url
            media_type
            source {
                name
                code
            }
        }
        source {
            name
            code
        }
        published
        views
        unique_views
        interaction {
            bookmarked
            liked
            commented
            viewed
            reviewed
        }
        custom_category {
            code
            pk
            name
        }
        page {
            name
            pk
            source {
                name
                code
            }
        }
        source {
            name
            code
        }
        social_id
        social_url
        visible
        date_created
        origin_addresses {
            pk
            name
            state
            email
            street
            post_code
            city
            country {
                name
                code
            }
            phone
            lat
            last_updated
            lng
        }
        shipping_range {
            pk
            name
            code
            description
        }
    }
`;

export const OrderFragment = gql`
    fragment OrderFragment on Order {
        pk
        tracking_code
        total_weight
        code
        name
        email
        phone
        buyer_profile {
            pk
            username
            name
            phone
            email
        }
        status {
            code
            name
        }
        fulfillment_status {
            name
            code
            description
        }
        description
        transaction_reference
        disbursement_date
        disbursement_reference
        amount
        discount
        amount_due
        amount_paid
        shipment_id
        shipment_ref
        shipment_ready
        shipping_method {
            delivery_type
            state
        }
        date_created
        profile {
            user_id
            username
            about
            name
            sales_volume
            followers_count
            following_count
            gender
            phone
            email
            store_name
            store_description
            store_location {
                pk
                name
                email
                phone
                city
                state
                lat
                lng
                post_code
                street
                country {
                    name
                    code
                }
            }
        }
        tracking
        delivery_address {
            pk
            name
            street
            state
            city
            email
            country {
                name
                code
            }
            phone
            lat
            lng
        }
        items {
            name
            code
            weight
            amount
            unit_amount
            description
            quantity
            post {
                pk
                code
                name
                stock
                weight
                images {
                    pk
                    url
                    media_type
                }
            }
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

export const BillingFragment = gql`
    fragment BillingFragment on BillingPayment {
        pk
        pin
        biller
        code
        user_id
        amount
        group {
            pk
            code
            name
            description
        }
        service {
            is_fixed_amount
            name
            code
            amount
            pk
            category {
                pk
                name
                reference_name
                description
                code
            }
        }
        customer_id
        customer_details {
            phone
            name
            email
        }
        status
        payment_code
        transaction_ref
        biller_status
        attempts {
            code
            transaction_reference
            status
        }
    }
`;

export const TopupsFragment = gql`
    fragment TopupsFragment on TopUpPayment {
        pk
        _id
        status {
            code
            name
        }
        code
        bank_code
        bank_transaction_code
        bank {
            name
            code
            description
        }
        topped_amount
        payable
        amount
        source
        comment
        reference
        date_created
        profile {
            user_id
            username
            email
            phone
            funds
            bvn
            escrow
        }
    }
`;

export const RequestFragment = gql`
    fragment RequestFragment on Request {
        pk
        code
        type {
            code
            name
            pk
        }
        url
        rule {
            code
            name
            description
        }
        amount
        date_created
        requires_shipping
        currency {
            name
            code
        }
        status {
            name
            code
            description
        }
        profile {
            name
            gender
            username
            email
            phone
        }
        target {
            username
            phone
            pk
            name
        }
        sender {
            username
            phone
            pk
            name
        }
        recipient {
            pk
            username
            name
            phone
            email
        }
    }
`;
