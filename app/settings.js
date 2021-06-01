let env = {};
if (process.browser){
    env = window.ENV || {};
    console.log("=im on the browser====", env.GRAPH_URI);

} else {
    env = {
        GRAPH_URI: process.env.GRAPH_URI,
        RINGER_URL: process.env.RINGER_URL,
        COOKIE_ID: process.env.COOKIE_ID,
        COOKIE_PROFILE_ID: process.env.COOKIE_PROFILE_ID,
        LOGIN_URL: process.env.LOGIN_URL,
        LOGIN_BASE_URL: process.env.LOGIN_BASE_URL,
        ANALYTICS_TRACKING_ID: process.env.ANALYTICS_TRACKING_ID,
        SUPPORT_PHONE: process.env.SUPPORT_PHONE,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    };
}

const settings = {
    uri: env.GRAPH_URI || "https://graph.staging.sendbox.co/graphql",
    // uri: "http://localhost:4000/graphql",
    baseURL: env.LOGIN_BASE_URL || "http://localhost:3000",
    loginURL: env.LOGIN_URL || "https://auth.staging.sendbox.co/login",
    logoutRedirect: env.LOGOUT_REDIRECT || "/",
    cookieId: env.COOKIE_ID || "__xcid",
    cookieProfileId: env.COOKIE_PROFILE_ID || "__xcpf",
    supportPhone: env.SUPPORT_PHONE || "+234 ( 01 ) 700 - 6150",
    googleAPIKey: env.GOOGLE_API_KEY || "AIzaSyARaE81UTxbfVgHK1zAwMkEjzI6OYVQ2MA",
    filestackAPIKey: env.FILESTACK_API_KEY || "AonK5ndJRFudBkMnEm2fsz",
};


module.exports = settings;
