import { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument() {
  return (
    <Html>
      <Head />
      <body className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
        <div className="container mx-auto md:max-w-2xl px-10 py-5">
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
