import { gql } from '@apollo/client';

export const ResolutionFragment = gql`
    fragment ResolutionFragment on ResolutionThread {
        _id
        inbox
        messages {
            _id
            type_
            cc
            bcc
            subject
            issue
            sla_status
            sla_id
            body
            text
            snippet
            sender
            reference_number
            opened_by_recipient
            sent_to
            reply_to
            attachments
            nylas_id
            nylas_thread_id
            read
            source
            receive_date
            date_created
            comment {
                type
                body
                subject
                send_as_email
            }
            responder {
                _id
                user_id
                name
                username
                email
                phone
            }
            profile {
                _id
                user_id
                name
                username
                email
                phone
            }
        }
        last_read {
            _id
            user_id
            name
            username
            email
            phone
        }
        resolver {
            _id
            user_id
            name
            username
            email
            phone
        }
        responder {
            _id
            user_id
            name
            username
            email
            phone
        }
        sender_profile {
            _id
            user_id
            name
            username
            email
            phone
        }
        subject
        read
        reference_number
        last_updated
        date_created
        last_read_time_stamp
        starred
        sla_id
        sla_status
        issue
        issue_id
        issue_status {
            name
            description
            code
        }
        currently_reading {
            _id
            user_id
            name
            username
            email
            phone
        }
        closed
        inbox
        participants
        opened_by_recipient
        source
        responded
        nylas_id
        nylas_thread_id
    }
`;
