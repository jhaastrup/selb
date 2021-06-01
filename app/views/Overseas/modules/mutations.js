import { gql } from '@apollo/client';
export const CREATE_IMPORT_FORWARDING_ADDRESS = gql`
    mutation createImportForwardingAddress(
        $name: String
        $street: String
        $city: String
        $state: String
        $country: String
        $email: String
        $phone: String
        $post_code: String
        $is_forwarding: Boolean
    ) {
        createImportForwardingAddress(
            name: $name
            street: $street
            city: $city
            state: $state
            country: $country
            post_code: $post_code
            is_forwarding: $is_forwarding
            email: $email
            phone: $phone
        ) {
            pk
            name
            street
            is_forwarding
            lat
            lng
            phone
            street
            city
        }
    }
`;
