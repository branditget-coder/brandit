import { Box, Container, Typography, Alert } from '@mui/material'
import { brandColors } from '../../theme'
import SEO from '../../components/common/SEO'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
      <Typography variant="h5" sx={{ mb: 1.5, color: brandColors.text, fontWeight: 700 }}>{title}</Typography>
      {children}
    </Box>
  )
}

export default function PrivacyPage() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <SEO
        title="Privacy Policy"
        description="BrandIt's Privacy Policy and data protection standards."
        canonicalUrl="https://go-brandit.vercel.app/privacy"
      />
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ mb: 1.5, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Privacy Policy</Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted, mb: 4 }}>Last updated: August 2026</Typography>

        <Alert severity="info" sx={{ mb: 4, borderRadius: '16px', fontWeight: 600, fontSize: '0.95rem' }}>
          BrandIt is operated by <strong>RAGHAV DHIR</strong>. We are committed to protecting your personal information and ensuring payment data security.
        </Alert>

        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff' }}>
          <Section title="1. Identity & Operating Entity">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              BrandIt (operated by legal entity <strong>RAGHAV DHIR</strong>) provides career and personal branding consulting services. This Privacy Policy governs the collection, use, and disclosure of personal information obtained when you visit go-brandit.vercel.app or purchase our services.
            </Typography>
          </Section>

          <Section title="2. Information We Collect">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              We collect information directly provided by you during account registration, service booking, or contact form submission. This includes your full name, email address, phone number, LinkedIn profile URL, career background, and service preferences.
            </Typography>
          </Section>

          <Section title="3. How We Use Your Information">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              Your information is used exclusively to:
              • Deliver ordered personal branding, profile setup, and content creation services.<br />
              • Coordinate 1-on-1 career advisory sessions.<br />
              • Send booking transaction confirmations, invoices, and service updates.<br />
              • We do NOT sell, rent, or lease customer data to third-party advertisers.
            </Typography>
          </Section>

          <Section title="4. Payment Security & Third-Party Processors">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              All payment transactions are securely encrypted and processed by PCI-DSS compliant payment gateways (PayU Payments Private Limited / Stripe / Razorpay). BrandIt does NOT store sensitive card numbers, CVVs, or NetBanking passwords on our servers.
            </Typography>
          </Section>

          <Section title="5. Contact Information">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              <strong>Proprietary Owner / Legal Entity:</strong> RAGHAV DHIR (Trade Name: BrandIt)<br />
              <strong>Operating Address:</strong> DeraBassi, Punjab, 140507, India<br />
              <strong>Privacy Email:</strong> brandit.get@gmail.com<br />
              <strong>Phone / WhatsApp:</strong> +91 8708231539 / +91 6284318951
            </Typography>
          </Section>
        </Box>
      </Container>
    </Box>
  )
}
