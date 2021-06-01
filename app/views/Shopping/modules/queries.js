import { gql } from '@apollo/client';
import { PostFragment } from './fragments';

export const PRODUCTS = gql`
    query getDiscoveryPublicPosts(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: PostFilter
        $query: String
        $view: String
    ) {
        getDiscoveryPublicPosts(
            page_by: $page_by
            sort_by: $sort_by
            query: $query
            filter_by: $filter_by
            view: $view
        ) {
            results {
                pk
                name
                slug
                stock
                weight
                on_sale
                pk
                regular_price
                description
                social_id
                social_url
                visible
                published
                date_created
                profile {
                    pk
                    name
                    username
                    about
                    is_seller
                    gender
                    phone
                    email
                    date_created
                    store_name
                    store_location {
                        name
                        city
                        post_code
                        country {
                            name
                        }
                    }
                    store_description

                    followers_count
                    following_count
                }
                category {
                    pk
                    name
                    description
                }
                source {
                    code
                    name
                }
                images {
                    pk
                    id
                    name
                    url
                    source {
                        code
                        name
                    }
                    media_type
                }
                cover_image {
                    pk
                    url
                    source {
                        code
                        name
                    }
                    media_type
                }
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

export const MORE_FROM_SELLER = gql`
    query getDiscoveryPublicPosts($merchant: String) {
        getDiscoveryPublicPosts(merchant: $merchant) {
            results {
                pk
                name
                slug
                stock
                weight
                on_sale
                pk
                regular_price
                description
                social_id
                social_url
                visible
                published
                date_created
                profile {
                    pk
                    name
                    username
                    about
                    is_seller
                    gender
                    phone
                    email
                    date_created
                    store_name
                    store_location {
                        name
                        city
                        post_code
                        country {
                            name
                        }
                    }
                    store_description
                    followers_count
                    following_count
                }
                category {
                    pk
                    name
                    description
                }
                source {
                    code
                    name
                }
                images {
                    pk
                    url
                    media_type
                    source {
                        code
                        name
                    }
                }
                cover_image {
                    pk
                    url
                    source {
                        code
                        name
                    }
                    media_type
                }
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

export const PRODUCT_DETAIL = gql`
    query getDiscoveryPublicPost($id: ID!) {
        getDiscoveryPublicPost(id: $id) {
            pk
            name
            slug
            stock
            weight
            price
            regular_price
            description
            cover_image {
                pk
                url
                media_type
            }
            images {
                pk
                url
                media_type
            }
            social_id
            social_url
            visible
            date_created
            published
            tags
            hashtags
            profile {
                pk
                user_id
                username
                name
                about
                is_seller
                followers_count
                following_count
                gender
                phone
                email
                profile_picture
                commission
                date_created
                store_name
                store_description
                store_location {
                    name
                    phone
                    city
                    post_code
                    country {
                        name
                    }
                }
            }
            source {
                code
                name
            }
        }
    }
`;

export const SHOPPING_CART = gql`
    query getDiscoveryCart($id: ID!) {
        getDiscoveryCart(id: $id) {
            pk
            code
            total_weight
            discount
            sub_total
            shipment_fee
            amount
            coupon_code
            items {
                amount
                quantity
                weight
                post {
                    name
                    stock
                    weight
                    on_sale
                    description
                    price
                    pk
                    views
                    units_sold
                    order_count
                    origin_addresses {
                        lat
                        lng
                        pk
                        phone
                        email
                        name
                        city
                        state
                        country {
                            name
                            pk
                            code
                        }
                    }
                    regular_price
                    images {
                        url
                        media_type
                        pk
                    }
                    social_id
                    social_url
                    date_created
                    published
                }
            }
            delivery_address {
                name
                user_id
                street
                state
                email
                city
                country {
                    name
                }
                phone
                post_code
            }

            profile {
                pk
                user_id
                username
                about
                name
                is_seller
                followers_count
                following_count
                gender
                phone
                email
                profile_picture
                commission
                date_created
                store_name
                store_description
                store_location {
                    name
                    user_id
                    street
                    state
                    email
                    city
                    country {
                        name
                    }
                    phone
                    post_code
                }
            }
            merchant {
                pk
                user_id
                username
                about
                name
                is_seller
                followers_count
                following_count
                gender
                phone
                email
                profile_picture
                commission
                date_created
                store_name
                store_description
                store_location {
                    name
                    user_id
                    street
                    state
                    email
                    city
                    country {
                        name
                    }
                    phone
                    post_code
                }
            }
        }
    }
`;

export const SELLER_DETAIL_AND_PRODUCTS = gql`
    query getDiscoverySeller($id: ID!, $idd: String) {
        seller: getDiscoverySeller(id: $id) {
            pk
            user_id
            username
            is_seller
            about
            followers_count
            following_count
            gender
            phone
            name
            email
            profile_picture
            commission
            date_created
            store_name
            store_description
            store_location {
                name
                city
                phone
                post_code
                country {
                    name
                }
            }
        }
        product: getDiscoveryPublicPosts(merchant: $idd) {
            results {
                pk
                name
                slug
                stock
                weight
                on_sale
                pk
                regular_price
                description
                social_id
                social_url
                visible
                published
                date_created
                profile {
                    pk
                    name
                    username
                    about
                    is_seller
                    gender
                    phone
                    email
                    date_created
                    store_name
                    store_location {
                        name
                        city
                        post_code
                        country {
                            name
                        }
                    }
                    store_description
                    followers_count
                    following_count
                }
                category {
                    pk
                    name
                    description
                }
                source {
                    code
                    name
                }
                images {
                    pk
                    url
                    media_type
                    source {
                        code
                        name
                    }
                }
                cover_image {
                    pk
                    url
                    source {
                        code
                        name
                    }
                    media_type
                }
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

export const CARTS = gql`
    query getDiscoveryCarts(
        $page_by: PageByInput
        $sort_by: SortInput
        $filter_by: CodeFilter
        $query: String
        $view: String
    ) {
        getDiscoveryCarts(page_by: $page_by, sort_by: $sort_by, query: $query, filter_by: $filter_by, view: $view) {
            results {
                pk
                code
                amount
                total_weight
                shipment_fee
                discount
                coupon_code
                merchant {
                    pk
                }
                items {
                    amount
                    quantity
                    weight
                    post {
                        pk
                        name
                        on_sale
                        description
                        slug
                        date_created
                        stock
                        social_id
                        social_url
                        price
                        regular_price
                        images {
                            url
                            media_type
                        }
                        cover_image {
                            url
                            media_type
                        }
                    }
                }
            }
        }
    }
`;

export const SHIPMENT_DEPENDENCIES = gql`
    query {
        shippingDependencies(
            destinationCountry: { page_by: { per_page: "300" }, sort_by: { order_by: "name", asc_desc: "asc" } }
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
        }
    }
`;

export const PAYMENT_DEPENDENCIES = gql`
    query GetDependencies {
        paymentDependencies(page_by: { page: "1", per_page: "100" }, view: "virtual") {
            cards {
                code
                name
                payment_source_code
                card_key
                bin
                last4
                brand
                mask
            }

            topup_options {
                code
                name
                payment_source_code
                card_key
            }

            account {
                code
                name
                payment_source_code
                card_key
                balance
            }

            profile {
                name
                funds
                username
                credits
                escrow
            }
        }
    }
`;

export const LANDING = gql`
    query getDiscoveryCategories {
        categories: getDiscoveryBusinessCategories {
            results {
                pk
                code
                description
                name
            }
        }
        collections: getDiscoveryPublicCollections(filter_by: { page: { op: "$eq", value: "home" } }) {
            results {
                name
                description
                pk
                criteria
                sourcing
                type
                items
                page {
                    name
                    code
                }
                layout {
                    name
                    code
                }
                criteria
            }
        }
    }
`;

export const CATEGORY_PAGE = gql`
    query GetCategoryPage(
        $id: String!
        $filter_by: SellersFilter
        $page_by: PageByInput
        $sort_by: SortInput
        $query: String
        $view: String
    ) {
        categories: getDiscoveryBusinessCategories {
            results {
                pk
                code
                description
                name
            }
        }
        category: getDiscoveryBusinessCategory(code: $id) {
            name
            pk
            code
        }
        sellers: getDiscoverySellers(
            filter_by: $filter_by
            sort_by: $sort_by
            page_by: $page_by
            query: $query
            view: $view
        ) {
            results {
                name
                username
                pk
                store_name
                store_description
                profile_picture
                followers_count
                following_count
                date_created
                is_seller
                business_category {
                    name
                }
                shipment_fee_rule {
                    code
                    name
                }
                store_location {
                    city
                    state
                    lat
                    lng
                    phone
                    street
                    country {
                        name
                        code
                    }
                }
            }
        }
    }
`;

export const STORE_PAGE = gql`
    query GetStorePage(
        $id: ID!
        $merchant_id: String
        $page_by: PageByInput
        $sort_by: SortInput
        $query: String
        $view: String
        $profile: AnyValue
    ) {
        seller: getDiscoverySeller(id: $id) {
            name
            store_name
            store_description
            profile_picture
            followers_count
            following_count
            date_created
            is_seller
            business_category {
                name
            }
            store_location {
                city
                state
                lat
                lng
                phone
                street
                country {
                    name
                    code
                }
            }
        }
        products: getDiscoveryPublicPosts(
            merchant: $merchant_id
            page_by: $page_by
            sort_by: $sort_by
            query: $query
            view: $view
        ) {
            metadata {
                sort_by {
                    asc_desc
                    order_by
                }
                page_by {
                    next_page
                    page
                    per_page
                    prev_page
                    total
                    pages
                }
                filter_by
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
                view
                query
            }
            results {
                ...PostFragment
            }
        }
        categories: getDiscoveryCustomCategories(filter_by: { profile: { op: "$eq", value: $profile } }) {
            results {
                name
                pk
                code
            }
        }
    }
    ${PostFragment}
`;
