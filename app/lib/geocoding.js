// import _ from 'lodash';

// /**
//  * Module to use google's geocoding & reverse geocoding.
//  */
// let Geocoder;
// export default Geocoder = {
//     apiKey: null,
//     options: {},

//     /**
//      * Initialize the module.
//      * @param {String} apiKey The api key of your application in google.
//      * @param {Object} [options] extra options for your geocoding request.
//      * @see https://developers.google.com/maps/documentation/geocoding/intro#geocoding
//      */
//     init(apiKey, options = {}) {
//         this.apiKey = apiKey;
//         this.options = options;
//     },

//     /**
//      * @returns {boolean} True if the module has been initiated. False otherwise.
//      */
//     get isInit() {
//         return !!this.apiKey;
//     },

//     /**
//      * Do <a href="https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding">(reverse) geocoding</a>, converting geographic coordinates into a human-readable address & vice-versa.
//      * Accepted parameters:
//      * <ul>
//      *     <li>from(Number latitude, Number longitude)</li>
//      *     <li>from(Array [latitude, longitude])</li>
//      *     <li>from(Object {latitude, longitude})</li>
//      *     <li>from(Object {lat, lng})</li>
//      *     <li>from(String address)</li>
//      * </ul>
//      * @returns {Promise.<Object>} Object containing informations about the place at the coordinates.
//      * @see https://developers.google.com/maps/documentation/geocoding/intro#GeocodingResponses
//      */
//     async from(...params) {
//         // check api key
//         if (!Geocoder.isInit) {
//             throw {
//                 code: Geocoder.Errors.NOT_INITIATED,
//                 message:
//                     "Geocoder isn't initialized. Call Geocoder.init function (only once), passing it your app's api key as parameter.",
//             };
//         }

//         // --- convert parameters ---
//         let queryParams;

//         // (latitude, longitude)
//         if (!isNaN(params[0]) && !isNaN(params[1])) {
//             queryParams = { latlng: `${params[0]},${params[1]}` };
//         }
//         // [latitude, longitude]
//         else if (params[0] instanceof Array) {
//             queryParams = { latlng: `${params[0][0]},${params[0][1]}` };
//         }
//         // {latitude, longitude}  or {lat, lng}
//         else if (params[0] instanceof Object) {
//             queryParams = {
//                 latlng: `${params[0].lat || params[0].latitude},${params[0].lng || params[0].longitude}`,
//             };
//         }
//         // address
//         else if (typeof params[0] === 'string') {
//             queryParams = { address: params[0] };
//         }

//         // --- start geocoding ---

//         // check query params
//         if (!queryParams) {
//             // no query params, means parameters where invalid
//             throw {
//                 code: Geocoder.Errors.INVALID_PARAMETERS,
//                 message: 'Invalid parameters : \n' + JSON.stringify(params, null, 2),
//             };
//         }

//         queryParams = { key: this.apiKey, ...this.options, ...queryParams };
//         // build url
//         const url = `https://maps.googleapis.com/maps/api/geocode/json?${toQueryParams(queryParams)}`;

//         let response, data;

//         // fetch
//         try {
//             response = await fetch(url);
//         } catch (error) {
//             throw {
//                 code: Geocoder.Errors.FETCHING,
//                 message: 'Error while fetching. Check your network.',
//                 origin: error,
//             };
//         }

//         // parse
//         try {
//             data = await response.json();
//         } catch (error) {
//             throw {
//                 code: Geocoder.Errors.PARSING,
//                 message:
//                     "Error while parsing response's body into JSON. The response is in the error's 'origin' field. Try to parse it yourself.",
//                 origin: response,
//             };
//         }

//         // check response's data
//         if (data.status !== 'OK') {
//             throw {
//                 code: Geocoder.Errors.SERVER,
//                 message:
//                     "Error from the server while geocoding. The received datas are in the error's 'origin' field. Check it for more informations.",
//                 origin: data,
//             };
//         }

//         return data;
//     },

//     async fromPlaceId(...params) {
//         // check api key
//         if (!Geocoder.isInit) {
//             throw {
//                 code: Geocoder.Errors.NOT_INITIATED,
//                 message:
//                     "Geocoder isn't initialized. Call Geocoder.init function (only once), passing it your app's api key as parameter.",
//             };
//         }

//         // --- convert parameters ---
//         let queryParams;

//         // (latitude, longitude)
//         if (!isNaN(params[0]) && !isNaN(params[1])) {
//             queryParams = { latlng: `${params[0]},${params[1]}` };
//         }
//         // [latitude, longitude]
//         else if (params[0] instanceof Array) {
//             queryParams = { latlng: `${params[0][0]},${params[0][1]}` };
//         }
//         // {latitude, longitude}  or {lat, lng}
//         else if (params[0] instanceof Object) {
//             queryParams = {
//                 latlng: `${params[0].lat || params[0].latitude},${params[0].lng || params[0].longitude}`,
//             };
//         }
//         // address
//         else if (typeof params[0] === 'string') {
//             queryParams = { place_id: params[0] };
//         }

//         // --- start geocoding ---

//         // check query params
//         if (!queryParams) {
//             // no query params, means parameters where invalid
//             throw {
//                 code: Geocoder.Errors.INVALID_PARAMETERS,
//                 message: 'Invalid parameters : \n' + JSON.stringify(params, null, 2),
//             };
//         }

//         queryParams = { key: this.apiKey, ...queryParams };
//         // build url
//         const url = `https://maps.googleapis.com/maps/api/geocode/json?${toQueryParams(queryParams)}`;

//         let response, data;

//         // fetch
//         try {
//             response = await fetch(url);
//         } catch (error) {
//             throw {
//                 code: Geocoder.Errors.FETCHING,
//                 message: 'Error while fetching. Check your network.',
//                 origin: error,
//             };
//         }

//         // parse
//         try {
//             data = await response.json();
//         } catch (error) {
//             throw {
//                 code: Geocoder.Errors.PARSING,
//                 message:
//                     "Error while parsing response's body into JSON. The response is in the error's 'origin' field. Try to parse it yourself.",
//                 origin: response,
//             };
//         }

//         // check response's data
//         if (data.status !== 'OK') {
//             throw {
//                 code: Geocoder.Errors.SERVER,
//                 message:
//                     "Error from the server while geocoding. The received datas are in the error's 'origin' field. Check it for more informations.",
//                 origin: data,
//             };
//         }

//         return data;
//     },

//     async autocomplete(input, params = {}) {
//         // check api key
//         if (!Geocoder.isInit) {
//             throw {
//                 code: Geocoder.Errors.NOT_INITIATED,
//                 message:
//                     "Geocoder isn't initialized. Call Geocoder.init function (only once), passing it your app's api key as parameter.",
//             };
//         }

//         // --- convert parameters ---
//         // let queryParams;

//         // (latitude, longitude)

//         // --- start geocoding ---

//         // check query params
//         // if (!input) {
//         //     // no query params, means parameters where invalid
//         //     throw {
//         //         code: Geocoder.Errors.INVALID_PARAMETERS,
//         //         message: 'Invalid parameters : \n' + JSON.stringify(input, null, 2),
//         //     };
//         // }

//         const queryParams = {
//             key: this.apiKey,
//             // input,
//             // ...this.options,
//             // ...params,
//         };

//         console.log({ queryParams });
//         // build url
//         const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${toQueryParams(queryParams)}`;
//         // const url = `https://maps.googleapis.com/maps/api/js?${toQueryParams(queryParams)}&libraries=places&callback=initMap`
//         let response, data;

//         // fetch
//         try {
//             response = await fetch(url);
//         } catch (error) {
//             throw {
//                 code: Geocoder.Errors.FETCHING,
//                 message: 'Error while fetching. Check your network.',
//                 origin: error,
//             };
//         }

//         // parse
//         try {
//             data = await response.json();
//         } catch (error) {
//             console.log(error);
//             throw {
//                 code: Geocoder.Errors.PARSING,
//                 message:
//                     "Error while parsing response's body into JSON. The response is in the error's 'origin' field. Try to parse it yourself.",
//                 origin: response,
//             };
//         }

//         // check response's data
//         if (data.status !== 'OK') {
//             throw {
//                 code: Geocoder.Errors.SERVER,
//                 message:
//                     "Error from the server while geocoding. The received datas are in the error's 'origin' field. Check it for more informations.",
//                 origin: data,
//             };
//         }

//         return data;
//     },

//     /**
//      * All possible errors.
//      */
//     Errors: {
//         /**
//          * Module hasn't been initiated. Call {@link Geocoder.init}.
//          */
//         NOT_INITIATED: 0,

//         /**
//          * Parameters are invalid.
//          */
//         INVALID_PARAMETERS: 1,

//         /**
//          * Error wile fetching to server.
//          * The error.origin property contains the original fetch error.
//          */
//         FETCHING: 2,

//         /**
//          * Error while parsing server response.
//          * The error.origin property contains the response.
//          */
//         PARSING: 3,

//         /**
//          * Error from the server.
//          * The error.origin property contains the response's body.
//          */
//         SERVER: 4,
//     },
// };

// /**
//  * Convert an object into query parameters.
//  * @param {Object} object Object to convert.
//  * @returns {string} Encoded query parameters.
//  */
// function toQueryParams(object) {
//     return Object.keys(object)
//         .filter((key) => !!object[key])
//         .map((key) => key + '=' + encodeURIComponent(object[key]))
//         .join('&');
// }

// export const formatAutocompleteAddress = (address) => {
//     const {
//         place_id,
//         reference,
//         structured_formatting: { main_text, secondary_text },
//         description,
//     } = address;
//     return { place_id, reference, main_text, secondary_text, description };
// };

// export const formatGeocodeAddress = (address, autoCompleteAddress) => {
//     // extract the actual address fields in a structured way based on google geocoding address
//     console.log({ address, autoCompleteAddress });
//     // extract the primary features
//     if (!address || address.results.length === 0) {
//         return {};
//     }

//     const result = address.results[0];
//     console.log('------even after autocomplete', result);
//     const { address_components, formatted_address, place_id, geometry } = result;

//     const country = _.find(address_components, (elem) => elem.types.includes('country'));
//     let state = _.find(address_components, (elem) => elem.types.includes('administrative_area_level_1'));
//     const city = _.find(address_components, (elem) => elem.types.includes('postal_town'));
//     const level_2 = _.find(address_components, (elem) => elem.types.includes('administrative_area_level_2'));
//     const neighborhood = _.find(address_components, (elem) => elem.types.includes('neighborhood'));
//     const locality = _.find(address_components, (elem) => elem.types.includes('locality'));
//     const route = _.find(address_components, (elem) => elem.types.includes('route'));
//     const street_number = _.find(address_components, (elem) => elem.types.includes('street_number'));
//     const post_code = _.find(address_components, (elem) => elem.types.includes('postal_code'));

//     const { location } = geometry;

//     let mainCityProp, backupCityProp;
//     switch (country.short_name) {
//         case 'NG':
//             mainCityProp = neighborhood;
//             backupCityProp = locality;
//             break;
//         case 'UK':
//             mainCityProp = city;
//             backupCityProp = level_2;
//             break;
//         case 'US':
//             mainCityProp = locality;
//             backupCityProp = neighborhood;
//             break;
//         default:
//             mainCityProp = city;
//             backupCityProp = locality;
//     }

//     // Abuja correction
//     if (state && state.long_name === 'Federal Capital Territory') {
//         state = locality;
//     }
//     console.log({
//         country,
//         state,
//         city,
//         level_2,
//         neighborhood,
//         locality,
//         route,
//         street_number,
//         post_code,
//         location,
//         autoCompleteAddress,
//     });
//     const parts = _.compact([street_number?.long_name, route?.long_name]).join(' ');
//     const street = _.compact(_.uniq([autoCompleteAddress?.main_text, parts])).join(' - ');
//     const formattedAddress = {
//         formatted_address,
//         place_id,
//         lat: location ? location.lat : null,
//         lng: location ? location.lng : null,
//         country: country ? country.short_name : null,
//         state: state ? state.long_name : null,
//         city: mainCityProp?.long_name || backupCityProp?.long_name || autoCompleteAddress?.secondary_text || null,
//         post_code: post_code ? post_code.long_name : null,
//         street,
//         formatted: true,
//     };

//     console.log(formattedAddress);

//     return formattedAddress;
// };

import _ from "lodash";

/**
 * Module to use google's geocoding & reverse geocoding.
 */


export const formatAutocompleteAddress = (address) => {
    const {
        place_id,
        reference,
        id,
        structured_formatting: { main_text, secondary_text },
        description,
    } = address;
    console.log({ address });
    return { id, place_id, reference, main_text, secondary_text, description };
};

export const formatGeocodeAddress = (address, autoCompleteAddress) => {
    // extract the actual address fields in a structured way based on google geocoding address
    // console.log({ address, autoCompleteAddress });
    // extract the primary features
    if (!address || address.length === 0) {
        return {};
    }

    const result = address[0];
    // console.log("------even after autocomplete", result);
    const { address_components, formatted_address, place_id, geometry } = result;

    const country = _.find(address_components, (elem) => elem.types.includes("country"));
    const state = _.find(address_components, (elem) => elem.types.includes("administrative_area_level_1"));
    const city = _.find(address_components, (elem) => elem.types.includes("postal_town"));
    const level_2 = _.find(address_components, (elem) => elem.types.includes("administrative_area_level_2"));
    const neighborhood = _.find(address_components, (elem) => elem.types.includes("neighborhood"));
    const locality = _.find(address_components, (elem) => elem.types.includes("locality"));
    const route = _.find(address_components, (elem) => elem.types.includes("route"));
    const street_number = _.find(address_components, (elem) => elem.types.includes("street_number"));
    const post_code = _.find(address_components, (elem) => elem.types.includes("postal_code"));

    const { location } = geometry;

    let mainCityProp, backupCityProp;
    switch (country.short_name) {
    case "NG":
        mainCityProp = neighborhood;
        backupCityProp = locality;
        break;
    case "UK":
        mainCityProp = city;
        backupCityProp = level_2;
        break;
    case "US":
        mainCityProp = locality;
        backupCityProp = neighborhood;
        break;
    default:
        mainCityProp = city;
        backupCityProp = locality;
    }

    const parts = _.compact([street_number ? street_number.long_name : "", route ? route.long_name : ""]).join(" ");
    const street = _.compact(_.uniq([autoCompleteAddress ? autoCompleteAddress.main_text : "", parts])).join(" - ");
    const formattedAddress = {
        formatted_address,
        place_id,
        lat: location ? location.lat() : null,
        lng: location ? location.lng() : null,
        country: country ? {name: country.long_name, code: country.short_name} : null,
        state: state ? state.long_name : null,
        city: mainCityProp
            ? mainCityProp.long_name
            : "" || backupCityProp
                ? backupCityProp.long_name
                : "" || autoCompleteAddress
                    ? autoCompleteAddress.secondary_text
                    : "" || null,
        post_code: post_code ? post_code.long_name : null,
        street,
        formatted: true,
    };

    // console.log(formattedAddress);

    return formattedAddress;
};

