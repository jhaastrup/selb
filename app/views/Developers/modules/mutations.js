import { gql } from '@apollo/client';
import { ApplicationFragment, TokenFragment } from "./fragments";

export const CREATE_APPLICATION = gql`
    mutation CreateApplication(
        $name: String!
        $description: String!
        $logo_url: String
        $redirect_urls: [String]
        $privacy_url: String
        $website_url: String
        $terms_and_conditions_url: String
    ){
        createExternalApplication(
            name: $name
            description: $description
            logo_url: $logo_url
            redirect_urls: $redirect_urls
            privacy_url: $privacy_url
            website_url: $website_url
            terms_and_conditions_url: $terms_and_conditions_url
        ){
            ...ApplicationFragment
        }
    }
    ${ApplicationFragment}
`;

export const UPDATE_APPLICATION = gql`
    mutation UpdateApplication(
        $id: ID!
        $name: String
        $description: String
        $logo_url: String
        $redirect_urls: [String]
        $privacy_url: String
        $website_url: String
        $terms_and_conditions_url: String
    ){
        updateExternalApplication(
            id: $id
            name: $name
            description: $description
            logo_url: $logo_url
            redirect_urls: $redirect_urls
            privacy_url: $privacy_url
            website_url: $website_url
            terms_and_conditions_url: $terms_and_conditions_url
        ){
            ...ApplicationFragment
        }
    }
    ${ApplicationFragment}
`;

export const RESET_SECRET = gql`
    mutation ResetSecret($id: ID!){
        resetExternalApplicationSecret(id: $id){
            ...ApplicationFragment
        }
    }
    ${ApplicationFragment}
`;

export const GENERATE_TOKEN = gql`
    mutation GenerateToken($app_id: ID!) {
        createExternalApplicationToken(app_id: $app_id) {
            ...TokenFragment
        }
    }
    ${TokenFragment}
`;

export const DELETE_APPLICATION = gql`
    mutation DeleteApplication($id: ID!) {
        deleteExternalApplication(id: $id) {
            title
            description
        }
    }
`;