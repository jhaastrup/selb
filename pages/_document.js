import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
//import settings from "app/settings";
let env = {
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
let env_vars = JSON.stringify(env);

class BaseDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="shortcut icon" type="image/x-icon" href="/images/logo.png" />
                </Head>
                <body>
                    <Main></Main>
                    <script dangerouslySetInnerHTML={{__html: `window.ENV=${env_vars}`,}}/>
                    <script type="text/javascript" src={`https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_API_KEY}&libraries=places`}></script>
                    <NextScript></NextScript>
                </body>
            </Html>
        );
    }
}

export default BaseDocument;
