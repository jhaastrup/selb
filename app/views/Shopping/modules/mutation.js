import { gql } from '@apollo/client';

export const ADD_ITEM_TO_CART = gql`
    mutation createDiscoveryCart($items: [CartItemInput]) {
        createDiscoveryCart(items: $items) {
            pk
            amount
            total_weight
            discount
            coupon_code
            items {
                quantity
                amount
                weight
                post {
                    pk
                    name
                    slug
                    stock
                    weight
                    on_sale
                    description
                }
            }
        }
    }
`;

export const UPDATE_CART = gql`
    mutation updateDiscoveryCart($id: ID!, $delivery_address: AddressInput) {
        updateDiscoveryCart(id: $id, delivery_address: $delivery_address) {
            pk
            code
            amount
            total_weight
            shipment_fee
            discount
            coupon_code
            delivery_address {
                name
                user_id
                street
                state
                email
                city
                country {
                    name
                    code
                }
                phone
                post_code
                date_created
                last_updated
            }
        }
    }
`;

export const EMPTY_CART = gql`
    mutation emptyDiscoveryCart($id: ID!) {
        emptyDiscoveryCart(id: $id) {
            pk
            code
        }
    }
`;

export const REMOVE_ITEM_FROM_CART = gql`
    mutation removeItemFromDiscoveryCart($id: ID!, $items: [String!]) {
        removeItemFromDiscoveryCart(id: $id, items: $items) {
            pk
            code
            amount
            discount
            coupon_code
            items {
                post {
                    pk
                    name
                    price
                    regular_price
                    description
                    social_id
                    social_url
                }
                quantity
                amount
            }
            delivery_address {
                name
                state
                street
                city
                country {
                    pk
                    code
                    name
                }
                phone
            }
        }
    }
`;

export const VERIFY_CART_PAYMENT = gql`
    mutation verifyDiscoveryCartPayment($txref: String) {
        verifyDiscoveryCartPayment(txref: $txref) {
            status {
                code
                name
                description
            }
            order {
                pk
                code
                name
                email
                status {
                    name
                    code
                }
            }
            code
        }
    }
`;

export const COMMENT_ON_PRODUCT = gql`
    mutation commentOnDiscoveryPost($id: ID!, $message: String!) {
        commentOnDiscoveryPost(id: $id, message: $message) {
            pk
            message
            date_created
            profile {
                name
                username
                pk
            }
        }
    }
`;

export const REVIEW_PRODUCT = gql`
    mutation reviewDiscoveryPost($id: ID!, $message: String, $stars: Int) {
        reviewDiscoveryPost(post_id: $id, message: $message, stars: $stars) {
            pk
            message
            stars
            post {
                pk
                name
                category {
                    description
                    name
                }
                description
                social_id
                social_url
            }
            date_created
            profile {
                name
                pk
                phone
                profile_picture
            }
        }
    }
`;

export const LIKE_PRODUCT = gql`
    mutation likeDiscoveryPost($id: ID!) {
        likeDiscoveryPost(post_id: $id) {
            pk
            profile {
                pk
                _id
                user_id
                username
                about
                name
                followers_count
                following_count
                gender
                phone
                email
            }
        }
    }
`;

export const FOLLOW_PROFILE = gql`
    mutation followDiscoveryProfile($id: ID!) {
        followDiscoveryProfile(id: $id) {
            active
            follower {
                pk
                user_id
                username
                about
                name
                followers_count
                following_count
                gender
                phone
                email
            }
            following {
                pk
                user_id
                username
                about
                name
                followers_count
                following_count
                gender
                phone
                email
            }
        }
    }
`;

export const CHECKOUT = gql`
    mutation discoveryCartCheckout($id: ID!) {
        discoveryCartCheckout(id: $id) {
            pk
            code
            escrow_code
            total
            amount
            payment_data {
                domain
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
        }
    }
`;
