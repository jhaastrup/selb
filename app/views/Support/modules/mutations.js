import { gql } from '@apollo/client';
import { ResolutionFragment } from './fragments';

export const REPORT_ISSUE = gql`
    mutation sendResolutionMessage(
        $email: String
        $subject: String
        $body: String
        $attachment: [AttachmentInput]
        $complaint: String
        $issue_code: String
    ) {
        sendResolutionMessage(
            email: $email
            subject: $subject
            body: $body
            attachment: $attachment
            complaint: $complaint
            issue_code: $issue_code
        ) {
            cc
            bcc
            subject
            text
        }
    }
`;

export const REPLY_THREAD = gql`
    mutation replyResolutionThreadAsCustomer($id: ID, $body: String) {
        replyResolutionThreadAsCustomer(id: $id, body: $body) {
            ...ResolutionFragment
        }
    }
    ${ResolutionFragment}
`;
