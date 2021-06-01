import * as React from "react";
import { v4 as uuidv4 } from 'uuid';
import {useQuery} from '@apollo/client';
import {GET_PROFILE } from "app/views/Layout/modules/queries";
// import { GET_PROFILE } from "./modules/queries";

export function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay], // Only re-call effect if value or delay changes
    );

    return debouncedValue;
}



export function uuid() {
    return uuidv4();
}



const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

  React.useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export const useUser = () => {
  const {data} = useQuery(GET_PROFILE, {
    fetchPolicy: "cache-and-network"
  })
  return data?.me
}

/**
 *
 * @param {String} name
 * @param {Function} func
 * @param {Object} params
 * @param {Boolean} includeData
 */
// export const useAnalytics = (name, func, params = {}, includeData = false) => {
//     const processAnalytics = (data = {}) => {
//         analytics().logEvent(name, data);
//     };

//     return (...args) => {
//         const payload = { ...params };
//         if (includeData) {
//             payload.args = args;
//         }
//         processAnalytics(payload);
//         return func(...args);
//     };
// };

// export const initAppsFlyer = (name, func, params = {}, includeData = false) => {
//     const processEvent = (data = {}) => {
//         appsFlyer.logEvent(name, data);
//     };
//     const amplitudeEvent = (properties = {}) => {
//         if (_.isEmpty(properties)) {
//             Amplitude.logEvent(name);
//         } else {
//             Amplitude.logEventWithProperties(name, properties);
//         }
//     };

//     const googleAnalytics = (data = {}) => {
//         analytics().logEvent(name, data);
//     };

//     return (...args) => {
//         const payload = { ...params };
//         if (includeData) {
//             payload.args = args;
//         }
//         processEvent(payload);
//         amplitudeEvent(payload);
//         googleAnalytics(payload);
//         return func(...args);
//     };
// };