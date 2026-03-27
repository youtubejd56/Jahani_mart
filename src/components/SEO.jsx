import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://jahani-mart.onrender.com';
const SITE_NAME = 'Jahani Mart';
const DEFAULT_DESC = 'Shop premium quality products at unbeatable prices. Free delivery across India. 10,000+ products, easy returns, secure payments.';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const SEO = ({
    title,
    description = DEFAULT_DESC,
    keywords = 'jahani mart, online shopping, buy online india, best prices, free delivery',
    image = OG_IMAGE,
    url = SITE_URL,
    type = 'website',
    product = null,
    noindex = false,
}) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    return (
        <Helmet>
            {/* Basic */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Product JSON-LD */}
            {product && product.name && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.name,
                        "description": (product.description || `${product.name} - Buy online at best price`).substring(0, 5000),
                        "image": product.all_image_urls || [image],
                        "sku": String(product.id),
                        "brand": {
                            "@type": "Brand",
                            "name": product.manufacturer || SITE_NAME
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
                    })}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
