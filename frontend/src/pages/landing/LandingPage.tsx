import SEO from '../../components/common/SEO'
import HeroSection from '../../components/sections/HeroSection'
import PricingSection from '../../components/sections/PricingSection'
import WhyBrandItSection from '../../components/sections/WhyBrandItSection'
import OurStorySection from '../../components/sections/OurStorySection'
import TestimonialsSection from '../../components/sections/TestimonialsSection'
import TeamSection from '../../components/sections/TeamSection'
import FAQSection from '../../components/sections/FAQSection'
import CTABannerSection from '../../components/sections/CTABannerSection'

export default function LandingPage() {
  return (
    <>
      <SEO
        title="Your Profile, Your Brand, Your Opportunity"
        description="Turn your LinkedIn profile into continuous inbound career opportunities with profile overhauls, 8 monthly strategy posts, and cold outreach engines from ₹129."
        keywords="LinkedIn personal branding, profile setup, career growth, executive branding, LinkedIn outreach engine"
        canonicalUrl="https://go-brandit.vercel.app/"
      />
      <HeroSection />
      <PricingSection />
      <WhyBrandItSection />
      <OurStorySection />
      <TestimonialsSection />
      <TeamSection />
      <FAQSection />
      <CTABannerSection />
    </>
  )
}
