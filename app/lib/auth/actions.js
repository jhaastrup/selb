import redirect from "./redirect";
import { setCookie, getCookie, removeCookie } from "./session";
import settings from "../../settings";
import base64 from "base-64";
import URL from "url-parse";

export const loginUser = async (token, target = "/") => {
    // Sign in a user by setting the cookie with the token received

    // const payloadHash = base64.encode(JSON.stringify(payload));
    setCookie(settings.cookieId, token);
    if (target) {
        redirect(target);
    }
};

export const setBusinessId = async (id) => {
    setCookie("x_sendbox_business_id", id)
}

export const removeBusinessId = async () => {
    removeCookie("x_sendbox_business_id")
}

export const logoutUser = (ctx = {}, target = settings.logoutRedirect) => {
    // Sign out user by removing the cookie from the broswer session
    if (process.browser) {
        removeCookie(settings.cookieId);
        redirect(target, ctx);
    }
};

export const getToken = ctx => {
    // Fetch the auth token for a user
    return getCookie(settings.cookieId, ctx.req);
};


export const setProfile = (profile) => {
    const p = base64.encode(JSON.stringify(profile));
    setCookie(settings.cookieProfileId, p);
};

export const getProfile = (ctx = {}) => {
    const profile = getCookie(settings.cookieProfileId, ctx.req);

    return profile ? JSON.parse(base64.decode(profile)) : {};
};

export const isAuthenticated = ctx => !!getToken(ctx);

export const redirectIfAuthenticated = (ctx, target = "/") => {
    if (isAuthenticated(ctx)) {
        redirect(target, ctx);
        return true;
    }
    return false;
};

export const redirectIfNotAuthenticated = (ctx, target = settings.baseURL) => {
    if (!isAuthenticated(ctx)) {
        const { query, resolvedUrl } = ctx;
        // console.log({ asPath });
        const { redirect_to = resolvedUrl, state } = query;
        const urlObj = new URL(settings.loginURL);
        urlObj.set("query", { domain: target, redirect_to, state });
        const redirectURL = urlObj.toString();
        redirect(redirectURL, ctx);
        return { query, resolvedUrl };
    }
    // if (!isAuthenticated(ctx)) {
    //     redirect(target, ctx);
    //     return true;
    // }

    return false;
};

export const getAuthHeaders = async (ctx = {}) => {
    const token = getToken(ctx);
    const headers = {};

    if (process.browser) {
        headers["X-Request-With"] = "XMLHttpRequest";
    }
    if (token) {
        headers["Authorization"] = `${token}`;
    }

    return headers;
};
