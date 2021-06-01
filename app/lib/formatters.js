import moment from 'moment';
import numeral from 'numeral';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { camelCase, snakeCase, sentenceCase, capitalCase, lowerCase } from 'change-case';
import creditcards from 'creditcards';
import types from 'creditcards-types';
import Type from 'creditcards-types/type';
import cardsy from 'cardsy';
import _, { isNumber } from 'lodash';

// Verve card type
const verveType = Type({
    name: 'Verve',
    pattern: /^(506099|5061[0-8][0-9]|50619[0-8])[0-9]{13}$/,
    groupPattern: /(\d{1,5})(\d{1,5})?(\d{1,5})?(\d{1,4})?/,
    eagerPattern: /^(506099|5061[0-8][0-9]|50619[0-8])$/,
    luhn: false,
});

const cardTypes = [verveType].concat(types);
const card = creditcards.withTypes(cardTypes).card;

export function formatCardNumber(number, separator = ' ') {
    const parsedValue = card.parse(number || '');
    const value = card.format(parsedValue, separator);
    // const value = creditcardutils.formatCardNumber(number);
    return value;
}

export function formatCardExpiration(number, separator = ' / ') {
    // const value = creditcardutils.formatCardExpiry(number);
    const value = cardsy.format.expiryString(number || '', separator);
    return value;
}

export function formatCardCvc(number) {
    const value = cardsy.format.cvc(number || '');
    return value;
}

export function getCardType(number) {
    const parsedValue = card.parse(number);
    const value = card.type(parsedValue, true);
    // const value = creditcardutils.parseCardType(number);
    return value;
}

export function validateCardNumber(number) {
    return card.isValid(number);
}

export function validateCardExpiry(number, separator = ' / ') {
    return cardsy.validate.expiryString(number, separator);
}

export function validateCardCvc(number) {
    return card.isValid(number);
}

export function formatOption(options, key, label, value) {
    if (_.isEmpty(value)) {
        return;
    }
    const option = _.find(options, { [key]: value });
    console.log({ option });
    return option ? option[label] : undefined;
}

export function formatDate(dateString, format = 'MMM DD, YYYY') {
    return moment(dateString).format(format);
}

export function fromNow(dateString) {
    return moment(dateString).fromNow();
}

export function formatNumber(value, format = '', rounding = Math.floor) {
    return numeral(value).format(format, rounding);
}

export function formatNumberString(value, format = '', empty = '') {
    if (!value) {
        return empty;
    }
    const val = numeral(value).format(format);
    if (value && value.toString().endsWith('.') && !val.includes('.')) {
        return `${val}.`;
    } else {
        return val;
    }
}

export function toNumber(value, decimalSeparator = '.', groupingSeparator = ',') {
    // console.log({ value, newValue: value.replace(",", "") });
    if (isNumber(value)) {
        return value;
    }
    
    const val = Number(
        value.replace(new RegExp(`\\${groupingSeparator}`, 'g'), '').replace(new RegExp(`\\${decimalSeparator}`), '.'),
    );

    console.log({ val });

    return val;
}

export function formatPhone(phoneNumberString, country_code = 'NG', format = 'INTERNATIONAL') {
    try {
        const phoneNumber = parsePhoneNumberFromString(phoneNumberString, country_code);
        return phoneNumber.format(format);
    } catch (e) {
        return phoneNumberString;
    }
}

export function formatString(value, format = 'sentence') {
    //   const options = {
    //     splitRegexp: /([a-z])([A-Z0-9])/g,
    //   };
    switch (format) {
        case 'capitalize':
            return capitalCase(value);
        case 'sentence':
            return sentenceCase(value);
        case 'snakecase':
            return snakeCase(value);
        case 'camelcase':
            return camelCase(value);
        case 'lowercase':
            return value.toLowerCase();
        case 'uppercase':
            return value.toUpperCase();
        case 'title':
        default:
            return sentenceCase(value);
    }
}
