/** @jsx jsx */
import { Global, css } from "@emotion/react";
import NProgress from "nprogress";
import { jsx, ThemeProvider } from "theme-ui";

import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";

import { Footer } from "~/components/footer";
import { NewsletterSection } from "~/components/newsletter-section";
import components from "~/components/theme-ui";

import "../styles/nprogress.css";
import theme from "../theme";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const reset = css`
  * {
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
  }

  #wrap {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Karla:,400,400i,700&amp;display=swap"
          rel="stylesheet"
        />
      </Head>
      <ThemeProvider theme={theme} components={components}>
        <Global styles={reset} />

        <div id="wrap">
          <Component {...pageProps} />

          <NewsletterSection />
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}
