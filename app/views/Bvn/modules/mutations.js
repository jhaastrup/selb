import { gql } from '@apollo/client';

export const VERIFY_BVN = gql`
    mutation verifyBvn($bvn: String!, $date_of_birth: String) {
        verifyBvn(bvn: $bvn, date_of_birth: $date_of_birth) {
            status
            message
            page
            data {
                first_name
                last_name
                dob
                mobile
                bvn
            }
        }
    }
`;

export const VERIFY_BVN_OTP = gql`
    mutation verifyBvnOtp($otp: String!) {
        verifyBvnOtp(otp: $otp) {
            status
            message
            page
        }
    }
`;
