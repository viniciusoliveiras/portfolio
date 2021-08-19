import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            rel="shortcut icon"
            href="images/favicon.svg"
            type="image/svg"
          />

          {/* Primary Meta Tags  */}
          <meta name="title" content="Vinícius Oliveira - Portfólio" />
          <meta
            name="description"
            content="Portfólio pessoal construído com React.js"
          />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content="https://portfolio-viniciusoliveiras.vercel.app/"
          />
          <meta property="og:title" content="Vinícius Oliveira - Portfólio" />
          <meta
            property="og:description"
            content="Portfólio pessoal construído com React.js"
          />
          <meta property="og:image" content="https://i.imgur.com/oSNgyWg.jpg" />

          {/* Twitter  */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:url"
            content="https://portfolio-viniciusoliveiras.vercel.app/"
          />
          <meta
            property="twitter:title"
            content="Vinícius Oliveira - Portfólio"
          />
          <meta
            property="twitter:description"
            content="Portfólio pessoal construído com React.js"
          />
          <meta
            property="twitter:image"
            content="https://i.imgur.com/oSNgyWg.jpg"
          />

          <link rel="apple-touch-icon" href="/icons/maskable_icon_x192.png" />

          <meta name="theme-color" content="#FFD369" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
