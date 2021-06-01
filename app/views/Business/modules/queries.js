import { gql } from '@apollo/client';
import { MerchantPostFragment, MerchantSalesFragment, AddressFragment } from './fragments';

export const MERCHANT_PRODUCTS = gql`
    query getDiscoveryAdminPosts(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: PostFilter
        $query: String
        $view: String
    ) {
        getDiscoveryAdminPosts(
            page_by: $page_by
            sort_by: $sort_by
            query: $query
            filter_by: $filter_by
            view: $view
        ) {
            results {
                ...MerchantPostFragment
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
    ${MerchantPostFragment}
`;

export const MERCHANT_PRODUCT = gql`
    query getDiscoveryAdminPost($id: ID!) {
        getDiscoveryAdminPost(id: $id) {
            ...MerchantPostFragment
        }
    }
    ${MerchantPostFragment}
`;

export const CUSTOMERS = gql`
    query discoveryMerchantCustomers(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: PostFilter
        $query: String
        $view: String
    ) {
        discoveryMerchantCustomers(
            page_by: $page_by
            sort_by: $sort_by
            query: $query
            filter_by: $filter_by
            view: $view
        ) {
            results {
                customer_id
                customer_name
                customer_email
                customer_phone
                trade_volume
                fulfilled_orders
                total_orders
                date_created
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

export const MERCHANT_SALES = gql`
    query getDiscoverySales(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: SalesFilter
        $query: String
        $view: String
    ) {
        getDiscoverySales(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by, view: $view) {
            results {
                ...MerchantSalesFragment
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
    ${MerchantSalesFragment}
`;

export const MERCHANT_SALE = gql`
    query getDiscoverySale($id: ID!) {
        getDiscoverySale(id: $id) {
            ...MerchantSalesFragment
        }
    }
    ${MerchantSalesFragment}
`;

export const BUSINESS_ORDER_DEPENDENCIES = gql`
    query getDependencies(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: PostFilter
        $query: String
        $view: String
    ) {
        dependencies: shippingDependencies(
            destinationCountry: { page_by: { per_page: "300" }, sort_by: { order_by: "name", asc_desc: "asc" } }
            itemType: { page_by: { per_page: "1000" } }
        ) {
            origin_countries {
                name
                code
                phone_code
                requires_post_code
                pk
            }
            destination_countries {
                name
                code
                phone_code
                pk
                requires_post_code
            }
            insurance_options {
                name
                code
                description
            }
            incoming_options {
                name
                code
            }
            item_types {
                name
                code
                insurance
                category
                category_name
            }
            addresses {
                ...AddressFragment
            }
            drop_off_locations {
                ...AddressFragment
            }
        }

        merchantProducts: getDiscoveryAdminPosts(
            page_by: $page_by
            sort_by: $sort_by
            query: $query
            filter_by: $filter_by
            view: $view
        ) {
            results {
                ...MerchantPostFragment
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
        me: me {
            default_address {
                name
                city
                state
                email
                phone
                country {
                    code
                }
                pk
                post_code
                lat
                lng
            }
        }
    }
    ${MerchantPostFragment}
    ${AddressFragment}
`;

export const DISCOVERY_PRODUCT_DEPENDENCIES = gql`
    query discoveryDependencies(
        $categoryInput: DependenciesInput
        $originAddressInput: DependenciesInput
        $shipmentCapacityInput: DependenciesInput
        $collectionCriteriaInput: DependenciesInput
        $pagesInput: DependenciesInput
        $bannerLayoutInput: DependenciesInput
        $shipmentFeeRuleInput: DependenciesInput
        $customCategoryInput: DependenciesInput
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: CodeFilter
        $query: String
        $view: String
    ) {
        businessCategories: getDiscoveryBusinessCategories(
            page_by: $page_by
            sort_by: $sort_by
            query: $query
            filter_by: $filter_by
            view: $view
        ) {
            results {
                pk
                code
                name
                description
            }
        }

        me: me {
            discoveryProfile{
                connected_stores{
                    name
                }
            }
        }

        dependencies: shippingDependencies(
            destinationCountry: { page_by: { per_page: "300" }, sort_by: { order_by: "name", asc_desc: "asc" } }
            itemType: { page_by: { per_page: "1000" } }
        ) {
            origin_countries {
                name
                code
                phone_code
                requires_post_code
                pk
            }
            destination_countries {
                name
                code
                phone_code
                pk
                requires_post_code
            }
            insurance_options {
                name
                code
                description
            }
            incoming_options {
                name
                code
            }
            item_types {
                name
                code
            }
            addresses {
                ...AddressFragment
            }
            drop_off_locations {
                ...AddressFragment
            }
        }

        discoveryDependencies: discoveryDependencies(
            categoryInput: $categoryInput
            originAddressInput: $originAddressInput
            shipmentCapacityInput: $shipmentCapacityInput
            collectionCriteriaInput: $collectionCriteriaInput
            pagesInput: $pagesInput
            bannerLayoutInput: $bannerLayoutInput
            shipmentFeeRuleInput: $shipmentFeeRuleInput
            customCategoryInput: $customCategoryInput
        ) {
            categories {
                pk
                description
                name
                slug
                banner {
                    pk
                    description
                    name
                    url
                    media_type
                }
            }
            origin_addresses {
                pk
                name
                state
                city
                street
                email
                phone
                post_code
                country {
                    name
                    code
                }
            }
            shipment_capacity {
                pk
                code
                name
                description
            }
            shipment_fee_rules {
                pk
                code
                name
                description
            }
            custom_categories {
                pk
                code
                name
                description
            }
        }
    }
    ${AddressFragment}
`;

export const LOAD_SOCIAL_MEDIA = gql`
    query loadMediaForDiscovery(
        $page_id: String
        $sort_by: SortInput
        $page_by: PageByInput
        $filter_by: CodeFilter
        $view: String
        $query: String
    ) {
        loadMediaForDiscovery(
            page_id: $page_id
            sort_by: $sort_by
            page_by: $page_by
            view: $view
            query: $query
            filter_by: $filter_by
        ) {
            results {
                profile
                source
                description
                media {
                    pk
                    id
                    name
                    url
                    source {
                        name
                        code
                    }
                    media_type
                }
                social_id
                social_url
                post
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
                filter_by
                view
                filtering_options {
                    name
                    code
                    type
                }
                query
                sort_by {
                    asc_desc
                    order_by
                }
            }
        }
    }
`;

export const LOAD_SOCIAL_PAGES = gql`
    query getSocialPagesAddedToDiscovery(
        $sort_by: SortInput
        $page_by: PageByInput
        $filter_by: CodeFilter
        $view: String
        $query: String
    ) {
        getSocialPagesAddedToDiscovery(
            sort_by: $sort_by
            page_by: $page_by
            filter_by: $filter_by
            view: $view
            query: $query
        ) {
            results {
                username
                name
                post_count
                source
                social_id
                email
                phone
                date_created
                social {
                    username
                    name
                    code
                    access_token
                    source
                    email
                }
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
                filter_by
                view
                filtering_options {
                    name
                    code
                    type
                }
                query
                sort_by {
                    asc_desc
                    order_by
                }
            }
        }
    }
`;

// weight
export const LOAD_EXTERNAL_PRODUCTS = gql`
    query getDiscoveryExternalProducts(
        $sort_by: SortInput
        $page_by: PageByInput
        $filter_by: JSON
        $view: String
        $query: String
        $source: String!
        $external_store_id: String
    ) {
        getDiscoveryExternalProducts(
            sort_by: $sort_by
            page_by: $page_by
            filter_by: $filter_by
            view: $view
            query: $query
            source: $source
            external_store_id: $external_store_id
        ) {
            results {
                pk
                code
                name
                stock
                description
                units_sold
                unique_views
                order_count
                height
                width
                length
                price
                regular_price
                on_sale
                social_id
                social_url
                images {
                    pk
                    id
                    name
                    url
                    media_type
                }
                category {
                    pk
                    description
                    name
                }
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
                filter_by
                view
                filtering_options {
                    name
                    code
                    type
                }
                query
                sort_by {
                    asc_desc
                    order_by
                }
            }
        }
    }
`;

export const MERCHANT_DISCOVERY_ORDERS = gql`
    query getDiscoveryOrders(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: CodeFilter
        $query: String
        $view: String
    ) {
        getDiscoveryOrders(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by, view: $view) {
            results {
                ...MerchantSalesFragment
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
    ${MerchantSalesFragment}
`;

export const MERCHANT_DISCOVERY_ORDER = gql`
    query getDiscoveryOrder($id: ID!) {
        getDiscoveryOrder(id: $id) {
            ...MerchantSalesFragment
        }
    }
    ${MerchantSalesFragment}
`;

export const LOAD_EXTERNAL_ORDERS = gql`
    query getDiscoveryExternalOrders(
        $sort_by: SortInput
        $page_by: PageByInput
        $filter_by: JSON
        $view: String
        $query: String
        $source: String!
        $external_store_id: String
    ) {
        getDiscoveryExternalOrders(
            sort_by: $sort_by
            page_by: $page_by
            filter_by: $filter_by
            view: $view
            query: $query
            source: $source
            external_store_id: $external_store_id
        ) {
            results {
                ...MerchantSalesFragment
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
                filter_by
                view
                filtering_options {
                    name
                    code
                    type
                }
                query
                sort_by {
                    asc_desc
                    order_by
                }
            }
        }
    }
    ${MerchantSalesFragment}
`;

export const DISCOVERY_ADDRESSES = gql`
    query getDiscoveryOriginAddresses(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: PostFilter
        $query: String
        $view: String
    ) {
        getDiscoveryOriginAddresses(
            page_by: $page_by
            sort_by: $sort_by
            query: $query
            filter_by: $filter_by
            view: $view
        ) {
            results {
                pk
                name
                user_id
                profile_id
                street
                state
                email
                city
                country {
                    name
                    code
                }
                phone
                lat
                lng
                id
                post_code
                date_created
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

export const GET_DELIVERY_QUOTE = gql`
    query getDeliveryQuote(
        $origin: QuoteAddressInput!
        $destination: QuoteAddressInput!
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
        getDeliveryQuote(
            origin: $origin
            destination: $destination
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
            rates {
                name
                description
                fee
                key
                delivery_fee
                delivery_priority
                fee_without_pickup
                pickup_fee
            }
            fee
            amount
            discount
            insurance_fee
            rate_key
            min_quoted_fee
            max_quoted_fee
            status {
                name
                code
            }
        }
    }
`;

export const DISCOVERY_CONNECTED_STORES = gql`
    query getDiscoveryConnectedStores(
        $sort_by: SortInput
        $page_by: PageByInput
        $filter_by: JSON
        $view: String
        $query: String
    ) {
        getDiscoveryConnectedStores(
            sort_by: $sort_by
            page_by: $page_by
            filter_by: $filter_by
            view: $view
            query: $query
        ) {
            results {
                key
                id
                source {
                    code
                    name
                }
                secret
                user_id
                name
                url
                avatar
                profile_id
            }
            metadata {
                sort_by {
                    asc_desc
                    order_by
                }
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
                filtering_options {
                    name
                    code
                    type
                }
                sorting_options {
                    name
                    code
                    type
                }
            }
        }
    }
`;

export const GET_PROFILE = gql`
    query {
        business: getBusinessShippingRewards {
            _id
            pk
            start_date
            end_date
            days_left
            shipments_more
            status
            shipments_made
            reward {
                _id
                status
                user_id
                type {
                    code
                    description
                    value
                    flat
                    threshold
                    cycle
                    event_type {
                        code
                        description
                        reputation_point
                        redeemable_point
                        experience_point
                        name
                    }
                    visible
                    type
                    domain
                }
                start_date
            }
            reward_type {
                code
                name
                domain
                description
                value
                flat
                threshold
                cycle
                visible
                type
            }
            shippingProfile {
                pk
                name
                forwarding_id
                last_active
                last_updated
                referral_code
                commission
                sms_subscription
                closed_balance
                email_subscription
                open_balance
                email
                hash
                last_visited
                authorization_header
                business_discount
                default_location {
                    name
                    pk
                    phone
                    street
                    city
                    lat
                    lng
                    street_line_2
                    country {
                        name
                        code
                    }
                }
            }
        }
        me: me {
            pk
            username
            name
            email
            default_entity {
                pk
                _id
                default
                name
                email
                phone
                description
                owner {
                    name
                    phone
                    username
                    website
                }
            }
            account_type {
                name
                pk
                description
                code
            }
            social {
                name
                access_token
            }
            paymentProfile {
                funds
                escrow
                accounts {
                    pk
                    type
                    balance
                    key
                    currency
                }
                virtual_bank_accounts {
                    account_name
                    account_number
                    bank_name
                }
            }
            discoveryProfile {
                pk
                ecommerce_stats {
                    products
                    orders
                    sales
                }
                username
                about
                name
                sales_volume
                followers_count
                following_count
                gender
                phone
                email
                profile_views
                profile_picture
                popularity
                store_url
                store_name
                store_banner
                store_description
                connected_stores {
                    key
                    source {
                        code
                        name
                    }
                    url
                    name
                    user_id
                }
            }
            referral_code
        }
    }
`;

export const PROFILE = gql`
    query me {
        me {
            pk
            username
            name
            email
            phone
            account_type {
                name
                pk
                description
                code
            }
            discoveryProfile {
                pk
                connected_stores {
                    key
                    source {
                        code
                        name
                    }
                    url
                    name
                    user_id
                }
            }
            reviewProfile {
                referral_code
            }
            website
            social {
                profile_id
                username
                name
                code
                access_token
                social_id
                username
                phone
            }
            gender
            photo
            date_of_birth
            referral_code
            registration_location
            bvn
            bvnValidated
            default_address {
                name
                city
                state
                email
                phone
                country {
                    code
                }
                pk
                post_code
                lat
                lng
            }
            default_entity {
                pk
                _id
                default
                name
                email
                phone
                description
                owner {
                    name
                    phone
                    username
                    website
                }
            }
        }
    }
`;

export const ENTITY_DEPENDENCIES = gql`
    query dependencies(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: CodeFilter
        $filter_entity: JSON
        $query: String
        $view: String
    ) {
        me: me {
            pk
            username
            name
            email
            phone
            account_type {
                name
                pk
                description
                code
            }
            discoveryProfile {
                pk
                connected_stores {
                    key
                    source {
                        code
                        name
                    }
                    url
                    name
                    user_id
                }
            }
            reviewProfile {
                referral_code
            }
            website
            social {
                profile_id
                username
                name
                code
                access_token
                social_id
                username
                phone
            }
            gender
            photo
            date_of_birth
            referral_code
            registration_location
            bvn
            bvnValidated
            default_address {
                name
                city
                state
                email
                phone
                country {
                    code
                }
                pk
                post_code
                lat
                lng
            }
            default_entity {
                pk
                _id
                default
                name
                email
                phone
                description
                owner {
                    name
                    phone
                    username
                    website
                }
            }
        }
        entityTypes: getEntityTypes(sort_by: $sort_by, page_by: $page_by, filter_by: $filter_entity) {
            results {
                pk
                code
                name
                description
            }
        }

        businessCategories: getDiscoveryBusinessCategories(
            page_by: $page_by
            sort_by: $sort_by
            query: $query
            filter_by: $filter_by
            view: $view
        ) {
            results {
                pk
                code
                name
                description
            }
        }
        shippingDependencies: shippingDependencies(
            destinationCountry: { page_by: { per_page: "300" }, sort_by: { order_by: "name", asc_desc: "asc" } }
            itemType: { page_by: { per_page: "1000" } }
        ) {
            origin_countries {
                name
                code
                phone_code
                requires_post_code
                pk
            }
            addresses {
                ...AddressFragment
            }
        }
    }
    ${AddressFragment}
`;

export const SENDBOX_USERS = gql`
    query getUsernames($page_by: PageByInput, $sort_by: SortInput, $filter_by: JSON) {
        getUsernames(page_by: $page_by, sort_by: $sort_by, filter_by: $filter_by) {
            results {
                pk
                value
                date_created
                user {
                    name
                    pk
                    username
                    email
                    phone
                }
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
