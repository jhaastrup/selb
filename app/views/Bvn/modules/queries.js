import { gql } from '@apollo/client';

export const DEPENDENCIES = gql`
    query {
        banks: banks(sort_by: { asc_desc: "asc" }, page_by: { per_page: "300" }) {
            results {
                code
                name
                description
                bank_transfer
                ussd
                pk
                pay_with_bank
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
                    page
                }
                filtering_options {
                    name
                    code
                }
                view
                query
            }
        }
        
    }
`;

export const VERIFICATION_DEPENDENCIES = gql`
    query {
        kyc: kycCheck {
            bvn_validated
            daily_withdrawal_limit
            monthly_withdrawal_limit
        }
    }
`;
