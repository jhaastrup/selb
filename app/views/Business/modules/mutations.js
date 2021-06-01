import { gql } from '@apollo/client';
import { MerchantPostFragment, MerchantSalesFragment, AddressFragment } from './fragments';

export const ADD_NEW_PRODUCT = gql`
    mutation createDiscoveryPost(
        $name: String!
        $email: String
        $phone: String
        $visible: Boolean
        $weight: Float
        $on_sale: Boolean
        $price: Float!
        $regular_price: Float
        $category: String
        $images: [ImageInput]
        $description: String
        $tags: [String]
        $hashtags: [String]
        $stock: Int
        $code: String
        $length: Float
        $width: Float
        $height: Float
        $shipping_range: [String]
        $origin_addresses: [String]
        $custom_category: String
    ) {
        createDiscoveryPost(
            name: $name
            email: $email
            phone: $phone
            visible: $visible
            weight: $weight
            on_sale: $on_sale
            price: $price
            regular_price: $regular_price
            category: $category
            images: $images
            description: $description
            tags: $tags
            hashtags: $hashtags
            stock: $stock
            code: $code
            length: $length
            width: $width
            height: $height
            shipping_range: $shipping_range
            origin_addresses: $origin_addresses
            custom_category: $custom_category
        ) {
            ...MerchantPostFragment
        }
    }
    ${MerchantPostFragment}
`;

export const LINK_SOCIAL = gql`
    mutation authSocialLink($url: String!, $channel: String!, $state: String) {
        authSocialLink(url: $url, channel: $channel, state: $state) {
            status
            action
            login_url
            description
        }
    }
`;

export const LINK_WOOCOMMERCE = gql`
    mutation ConnectStorePlugin($store_url: String!, $return_url: String) {
        ConnectStorePlugin(store_url: $store_url, return_url: $return_url) {
            oauthUrl
        }
    }
`;

export const LINK_SHOPIFY_ = gql`
    mutation ConnectShopifyStorePlugin($store_url: String!, $return_url: String) {
        ConnectShopifyStorePlugin(store_url: $store_url, return_url: $return_url) {
            oauthUrl
        }
    }
`;

export const DELETE_POST = gql`
    mutation deleteDiscoveryPost($id: ID!) {
        deleteDiscoveryPost(id: $id) {
            description
            title
        }
    }
`;

export const MERCHANT_GENERATE_ORDER = gql`
    mutation merchantGenerateOrder(
        $customer_name: String
        $customer_phone: String
        $customer_email: String
        $delivery_address: AddressInput
        $items: [CartItemInput]
        $customer_ships: Boolean
        $shipment_fee: Float
    ) {
        merchantGenerateOrder(
            customer_name: $customer_name
            customer_phone: $customer_phone
            customer_email: $customer_email
            delivery_address: $delivery_address
            items: $items
            customer_ships: $customer_ships
            shipment_fee: $shipment_fee
        ) {
            pk
            tracking
            tracking_code
            code
            name
            email
            phone
            total_weight
            amount_paid
        }
    }
`;

export const IMPORT_PRODUCTS_FROM_STORE = gql`
    mutation discoveryExternalProducts($ids: [String]!, $source: String!, $external_store_id: String) {
        discoveryExternalProducts(ids: $ids, source: $source, external_store_id: $external_store_id) {
            pk
            code
            name
            description
        }
    }
`;

export const IMPORT_ORDERS_FROM_STORE = gql`
    mutation discoveryExternalOrders($ids: [String]!, $source: String!, $external_store_id: String) {
        discoveryExternalOrders(ids: $ids, source: $source, external_store_id: $external_store_id) {
            pk
            code
            name
            description
        }
    }
`;

export const UPDATE_DISCOVERY_POST = gql`
    mutation updateDiscoveryPost(
        $id: ID!
        $name: String
        $visible: Boolean
        $on_sale: Boolean
        $category: String
        $description: String
        $price: Float
        $regular_price: Float
        $tags: [String]
        $hashtags: [String]
        $images: [ImageInput]
        $weight: Float
        $stock: Int
        $code: String
        $length: Float
        $width: Float
        $height: Float
        $shipping_range: [String]
        $origin_addresses: [String]
        $custom_category: String
    ) {
        updateDiscoveryPost(
            id: $id
            name: $name
            visible: $visible
            on_sale: $on_sale
            category: $category
            description: $description
            price: $price
            regular_price: $regular_price
            tags: $tags
            hashtags: $hashtags
            images: $images
            weight: $weight
            stock: $stock
            code: $code
            length: $length
            width: $width
            height: $height
            shipping_range: $shipping_range
            origin_addresses: $origin_addresses
            custom_category: $custom_category
        ) {
            pk
            code
            name
            stock
            status {
                name
                description
            }
        }
    }
`;

export const FULFIL_DELIVERY_ORDER = gql`
    mutation bookDiscoveryDelivery($origin: ID!, $order: ID!, $rate_key: String) {
        bookDiscoveryDelivery(origin: $origin, order: $order, rate_key: $rate_key) {
            pk
            code
            status {
                name
                code
            }
            weight
            amount
        }
    }
`;

export const REGISTER_BUSINESS = gql`
    mutation registerEntity(
        $name: String!
        $email: String
        $phone: String!
        $type: String!
        $description: String
        $category: String
    ) {
        registerEntity(
            name: $name
            email: $email
            phone: $phone
            type: $type
            description: $description
            category: $category
        ) {
            pk
            default
            name
            phone
            description
        }
    }
`;

export const CREATE_ADDRESS = gql`
    mutation createAddress(
        $name: String
        $email: String
        $phone: String
        $street: String
        $street_line_2: String
        $city: String!
        $state: String!
        $country: String!
        $lat: Float
        $lng: Float
        $post_code: String
    ) {
        createAddress(
            name: $name
            email: $email
            phone: $phone
            street: $street
            street_line_2: $street_line_2
            city: $city
            state: $state
            country: $country
            lat: $lat
            lng: $lng
            post_code: $post_code
        ) {
            pk
            name
            name
            email
            phone
            street
            street_line_2
            city
            state
            country {
                name
                code
            }
            lat
            lng
            post_code
        }
    }
`;

export const CREATE_BUSINESS_USERNAME = gql`
    mutation usernameUpdate($id: ID, $username: String) {
        usernameUpdate(id: $id, username: $username) {
            pk
            name
            email
        }
    }
`;

export const CREATE_CUSTOM_CATEGORY = gql`
    mutation createDiscoveryCustomCategory($name: String!, $description: String) {
        createDiscoveryCustomCategory(name: $name, description: $description) {
            pk
            code
            name
            description
        }
    }
`;

export const SET_BUSINESS_CATEGORY = gql`
    mutation setDiscoveryBusinessCategory($business_category: String!) {
        setDiscoveryBusinessCategory(business_category: $business_category) {
            pk
            name
        }
    }
`;

export const DELETE_CUSTOM_CATEGORY = gql`
    mutation deleteDiscoveryCustomCategory($id: ID!) {
        deleteDiscoveryCustomCategory(id: $id) {
            description
            title
        }
    }
`;

export const SET_DEFAULT_ADDRESS  = gql`
    mutation setDefaultAddress($id: ID) {
        setDefaultAddress(id: $id) {
            pk
            name
            email
        }
    }
`;
