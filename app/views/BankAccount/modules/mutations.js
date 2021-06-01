import { gql } from '@apollo/client';

export const VERIFY_BANK = gql`
    mutation verifyBankAccount($account_number: String!, $bank_code: String!) {
        verifyBankAccount(account_number: $account_number, bank_code: $bank_code) {
            message
            payload {
                bank_code
                account_name
                account_number
            }
            bank {
                code
                name
                description
                pay_with_bank
                pk
                bank_transfer
                ussd
            }
        }
    }
`;

export const VERIFY_BANK_OTP = gql`
    mutation verifyBankOtp($account_number: String!, $bank_code: String!, $otp: String!) {
        verifyBankOtp(account_number: $account_number, bank_code: $bank_code, otp: $otp) {
            message
            status
        }
    }
`;

export const DELETE_BANK = gql`
    mutation deleteBankAccount($id: ID!) {
        deleteBankAccount(id: $id) {
            title
            description
        }
    }
`;

export const DELETE_CARD = gql`
    mutation deleteCard($id: ID!) {
        deleteCard(id: $id) {
            title
            description
        }
    }
`;
