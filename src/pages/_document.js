import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />

				{/* Primary Meta Tags */}
				<meta name='title' content='Toko Xyz' />
				<meta name='description' content='Selling item' />
				<meta
					name='keywords'
					content='nextjs, ecommerce, fashion, JavaScript, '
				/>
				<meta name='author' content='xyz' />

				{/* Open Graph / Facebook */}
				<meta property='og:type' content='website' />
				<meta property='og:url' content='https://example.com' />
				<meta property='og:title' content='toko xyz' />
				<meta
					property='og:description'
					content='A detailed description of your website that summarizes the content and purpose.'
				/>
				<meta property='og:image' content='https://example.com/image.jpg' />

				{/* Twitter */}
				<meta property='twitter:card' content='summary_large_image' />
				<meta property='twitter:url' content='https://example.com' />
				<meta property='twitter:title' content='Your Website Title' />
				<meta
					property='twitter:description'
					content='A detailed description of your website that summarizes the content and purpose.'
				/>
				<meta
					property='twitter:image'
					content='https://example.com/image.jpg'
				/>

				{/* Additional Meta Tags */}
				<meta name='robots' content='index, follow' />
				<meta name='theme-color' content='#317EFB' />

				{/* Favicon and Icons */}
				<link rel='icon' href='/favicon.ico' />
				<link rel='apple-touch-icon' href='/apple-touch-icon.png' />
				{/* <link rel='manifest' href='/site.webmanifest' /> */}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
