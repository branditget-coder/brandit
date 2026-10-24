import SEO from '../../components/common/SEO'
import PricingSection from '../../components/sections/PricingSection'
import CTABannerSection from '../../components/sections/CTABannerSection'
import { Box } from '@mui/material'

export default function PricingPage() {
  return (
    <Box sx={{ pt: { xs: 4, md: 2 } }}>
      <SEO
        title="Transparent Pricing & Plans — Starting at ₹129"
        description="Explore BrandIt's transparent packages for LinkedIn profile setup, 8 monthly strategy posts, and network outreach engines. No hidden fees."
        keywords="BrandIt pricing, LinkedIn optimization cost, personal branding packages, career growth plans"
        canonicalUrl="https://go-brandit.vercel.app/pricing"
      />
      <PricingSection />
      <CTABannerSection />
    </Box>
  )
}
