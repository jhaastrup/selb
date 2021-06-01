import { gql } from "@apollo/client";

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
