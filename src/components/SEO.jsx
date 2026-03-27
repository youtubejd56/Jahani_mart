import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';

const SITE_URL = 'https://jahani-mart.onrender.com';
const SITE_NAME = 'Jahani Mart';
const DEFAULT_DESC = 'Shop premium quality products at unbeatable prices. Free delivery across India. 10,000+ products, easy returns, secure payments. Trusted by millions of customers. Fast shipping and secure payments. Jahani Mart - Your trusted online shopping partner since 2020. Serving customers across 50+ cities with 24/7 customer support. Official partner of leading brands. Cash on delivery available. EMI options starting from ₹99/month. 100% genuine products guaranteed. 7-day return policy. Same-day delivery in select cities. Download our app for exclusive deals and faster checkout. Shop now and get ₹100 off on first order. Rated 4.8/5 by 50,000+ customers. 24-hour customer service available. Contact us at support@jahanimart.com or call +91-XXXXXXXXXX. Visit our stores in Delhi, Mumbai, Bangalore, Chennai, Kolkata and Hyderabad.';
const OG_IMAGE = `${SITE_URL}/Screenshot%202026-03-26%20144234.png`;
const SITE_ICON = `${SITE_URL}/favicon.ico`;
const TWITTER_HANDLE = '@jahanimart';
const CONTACT_EMAIL = 'support@jahanimart.com';
const BUSINESS_TYPE = 'E-commerce';
const COUNTRY = 'India';
const SOCIAL_LINKS = [
    'https://www.facebook.com/jahanimart',
    'https://www.instagram.com/jahanimart',
    'https://www.twitter.com/jahanimart',
    'https://www.linkedin.com/company/jahanimart'
];

const SEO = ({
    title,
    description = DEFAULT_DESC,
    keywords = 'jahani mart, online shopping, buy online india, best prices, free delivery',
    image = OG_IMAGE,
    url = SITE_URL,
    type = 'website',
    product = null,
    noindex = false,
    lang = 'en',
    facebookAppId = 'your-facebook-app-id',
    twitterHandle = '@jahanimart',
}) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const metaDescription = useMemo(() => description.substring(0, 160), [description]);

    let productJsonLd = null;
    if (product && product.name) {
        try {
            const ldData = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": String(product.name).replace(/[<>&"']/g, ''),
                "description": String(product.description || `${product.name} - Buy online at best price`).substring(0, 5000).replace(/[<>&"']/g, ''),
                "image": product.all_image_urls || [image],
                "sku": String(product.id),
                "brand": {
                    "@type": "Brand",
                    "name": String(product.manufacturer || SITE_NAME).replace(/[<>&"']/g, '')
                },
                "offers": {
                    "@type": "Offer",
                    "url": `${SITE_URL}/products/${product.id}`,
                    "priceCurrency": "INR",
                    "price": product.discount_price || product.price,
                    "availability": product.stock > 0
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                    "seller": {
                        "@type": "Organization",
                        "name": SITE_NAME
                    }
                },
                ...(product.rating && {
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": product.rating,
                        "bestRating": "5",
                        "worstRating": "1",
                        "reviewCount": product.review_count || 1
                    }
                })
            };
            productJsonLd = JSON.stringify(ldData);
        } catch (e) {
            productJsonLd = null;
        }
    }

    return (
        <Helmet>
            {/* Basic */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={keywords} />
            <meta name="language" content={lang} />
            <meta name="author" content={SITE_NAME} />
            <meta name="contact" content={CONTACT_EMAIL} />
            <link rel="canonical" href={url} />
            <link rel="icon" type="image/x-icon" href={SITE_ICON} />
            <link rel="apple-touch-icon" href={OG_IMAGE} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="en_IN" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={fullTitle} />
            <meta property="og:see_also" content="https://jahani-mart.onrender.com" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:image:alt" content={fullTitle} />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />

            {/* Facebook */}
            <meta property="fb:app_id" content={facebookAppId} />
            <meta property="fb:admins" content="your-facebook-admin-id" />

            {/* Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
                "logo": OG_IMAGE,
                "description": DEFAULT_DESC.substring(0, 500),
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-XXXXXXXXXX",
                    "contactType": "customer service",
                    "email": CONTACT_EMAIL
                },
                "sameAs": SOCIAL_LINKS,
                "potentialAction": [
                    {
                        "@type": "SearchAction",
                        "target": `${SITE_URL}/products?q={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    },
                    {
                        "@type": "WebSite",
                        "url": SITE_URL,
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": `${SITE_URL}/products?q={search_term_string}`,
                            "query-input": "required name=search_term_string"
                        }
                    }
                ]
            }) }} />

            {/* Product JSON-LD */}
            {productJsonLd && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd }} />
            )}
        </Helmet>
    );
};

export default SEO;