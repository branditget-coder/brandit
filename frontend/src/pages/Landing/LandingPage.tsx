import SEO from '../../components/common/SEO'
import HeroSection from '../../components/sections/HeroSection'
import TrustedBySection from '../../components/sections/TrustedBySection'
import PricingSection from '../../components/sections/PricingSection'
import WhyBrandItSection from '../../components/sections/WhyBrandItSection'
import TeamSection from '../../components/sections/TeamSection'
import FAQSection from '../../components/sections/FAQSection'
import CTABannerSection from '../../components/sections/CTABannerSection'

export default function LandingPage() {
  return (
    <>
      <SEO
        title="Your Profile, Your Brand, Your Opportunity"
        description="Turn your LinkedIn profile into continuous inbound career opportunities with profile overhauls, 8 monthly strategy posts, and cold outreach engines from ₹99."
        keywords="LinkedIn personal branding, profile setup, career growth, executive branding, LinkedIn outreach engine"
        canonicalUrl="https://go-brandit.vercel.app/"
      />
      <HeroSection />
      <TrustedBySection />
      <PricingSection />
      <WhyBrandItSection />
      <TeamSection />
      <FAQSection />
      <CTABannerSection />
    </>
  )
}
