import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
}

const DEFAULT_SEO = {
    title: 'Ramay Humour Academy | Master Leadership through Comedy',
    description: 'We use comedy mechanics to build world-class communication, confidence, and leadership skills. Join the premier institution for soft skills development.',
    keywords: 'comedy, leadership, communication skills, executive presence, humor training, soft skills, public speaking',
    ogImage: '/og-image.jpg',
    ogType: 'website'
};

export const SEO = ({
    title,
    description = DEFAULT_SEO.description,
    keywords = DEFAULT_SEO.keywords,
    ogImage = DEFAULT_SEO.ogImage,
    ogType = DEFAULT_SEO.ogType
}: SEOProps) => {
    const fullTitle = title ? `${title} | Ramay Humour Academy` : DEFAULT_SEO.title;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Update or create meta tags
        const updateMetaTag = (name: string, content: string, property = false) => {
            const attribute = property ? 'property' : 'name';
            let tag = document.querySelector(`meta[${attribute}="${name}"]`);

            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attribute, name);
                document.head.appendChild(tag);
            }

            tag.setAttribute('content', content);
        };

        // Standard meta tags
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);

        // Open Graph tags
        updateMetaTag('og:title', fullTitle, true);
        updateMetaTag('og:description', description, true);
        updateMetaTag('og:image', ogImage, true);
        updateMetaTag('og:type', ogType, true);

        // Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', fullTitle);
        updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', ogImage);
    }, [fullTitle, description, keywords, ogImage, ogType]);

    return null;
};
