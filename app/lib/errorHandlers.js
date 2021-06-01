/**
 *
 * @param {Array} graphQLErrors array of graphql errors
 */
export const handleValidationErrors = (graphQLErrors = []) => {
    let errors = {};
    graphQLErrors.forEach((error) => {
        const { extensions: { exception: { validationErrors } } = {} } = error;
        errors = { ...errors, ...validationErrors };
    });

    return errors;
};

export const detectErrors = (graphQLErrors = []) => {
    let errorCode;
    graphQLErrors.forEach((error) => {
        const { extensions: { code } = {} } = error;
        errorCode = code;
    });

    return errorCode;
};

export const handleNetworkErrors = (networkErrors = {}) => {
    let response;
    if (networkErrors && networkErrors.statusCode === 300) {
        response = 'Bad Request';
    } else if (networkErrors && networkErrors.statusCode === 400) {
        response = 'Malformed Request';
    } else if (networkErrors && networkErrors.statusCode === 404) {
        response = 'Error Loading Page';
    } else if (networkErrors && networkErrors.statusCode === 500) {
        response = 'Internal Server Error';
    } else {
        response = !networkErrors ? 'Network Error' : 'System Error';
    }

    return response;
};
