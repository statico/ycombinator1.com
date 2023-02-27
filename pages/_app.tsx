import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          src="https://s.langworth.com/data.js"
          data-token="decfacac"
          defer
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
