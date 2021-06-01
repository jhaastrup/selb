import { gql } from '@apollo/client';

export const ApplicationFragment = gql`
    fragment ApplicationFragment on ExternalApplication {
        pk
        user{
            pk
            name
            email
            phone
            username
        }
        name
        description
        logo_url
        client_secret
        application_token{
            pk
            access_token
            refresh_token
            user_access
            access_token_expires_in
            access_token_expired
            date_created
            last_updated
        }
        web_hooks
        privacy_url
        website_url
        terms_and_conditions_url
        status{
            name
            code
            description
        }
        date_created
        last_updated
    }
`;

export const TokenFragment = gql`
    fragment TokenFragment on ExternalApplicationToken {
        pk
        application{
            pk
            user{
                pk
                name
                email
                phone
                username
            }
            name
            description
            logo_url
            client_secret
            web_hooks
            privacy_url
            website_url
            terms_and_conditions_url
            status{
                name
                code
                description
            }
            date_created
            last_updated
        }
        access_token
        refresh_token
        user_access
        access_token_expires_in
        access_token_expired
        date_created
        last_updated
    }
`;