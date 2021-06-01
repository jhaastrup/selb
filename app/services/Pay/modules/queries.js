import { gql } from '@apollo/client';

export const PAYMENT_DEPENDENCIES = gql`
    query GetDependencies {
        dependencies: paymentDependencies(page_by: { page: "1", per_page: "100" }, view: "virtual") {
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

            currencies {
                pk
                name
                code
                symbol
                enabled
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
