import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
}

export default function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const baseTitle = 'BrandIt | LinkedIn Personal Branding & Growth Engine'
    document.title = title ? `${title} | BrandIt` : baseTitle

    // 2. Helper to set or create meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attrName, attrVal)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // 3. Update description & keywords
    if (description) {
      setMetaTag('name', 'description', description)
      setMetaTag('property', 'og:description', description)
      setMetaTag('name', 'twitter:description', description)
    }

    if (keywords) {
      setMetaTag('name', 'keywords', keywords)
    }

    // 4. Update OpenGraph and Twitter title
    const fullTitle = title ? `${title} | BrandIt` : baseTitle
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('property', 'og:type', ogType)

    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage)
      setMetaTag('name', 'twitter:image', ogImage)
    }

    // 5. Update Canonical link
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.setAttribute('href', canonicalUrl)
      setMetaTag('property', 'og:url', canonicalUrl)
      setMetaTag('name', 'twitter:url', canonicalUrl)
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType])

  return null
}
