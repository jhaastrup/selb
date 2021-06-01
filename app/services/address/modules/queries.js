
import { gql } from '@apollo/client';

export const ADDRESS_DEPENDENCIES = gql`
    query {
        dependencies: shippingDependencies(
            destinationCountry: { page_by: { per_page: "300" }, sort_by: { order_by: "name", asc_desc: "asc" } }
        ) {
            origin_countries {
                name
                code
                phone_code
                requires_post_code
                pk
            }
            destination_countries {
                name
                code
                phone_code
                pk
                requires_post_code
            }
        }
    }
`;