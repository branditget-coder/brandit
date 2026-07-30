import { Box, Container, Typography } from '@mui/material'
import { brandColors } from '../../theme'

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
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ mb: 1.5, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Privacy Policy</Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted, mb: 4 }}>Last updated: July 2026</Typography>
        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff' }}>
          <Section title="1. Information We Collect">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              We collect information you provide directly to us during service booking or profile setup, including your full name, email address, phone number, LinkedIn URL, and professional background.
            </Typography>
          </Section>
          <Section title="2. How We Use Your Information">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              We use your information exclusively to deliver personal branding services, draft tailored posts, coordinate cold outreach campaigns, and process billing. We never sell or lease your personal data.
            </Typography>
          </Section>
          <Section title="3. Payment Processing & Security">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              All online payments are securely handled by trusted gateways (Stripe / Razorpay). BrandIt does not store full credit card or bank account details on our servers. All transactions are non-refundable.
            </Typography>
          </Section>
          <Section title="4. Contact Us">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              For privacy-related inquiries, please email brandit.get@gmail.com or contact Kritika Dhawan (Customer Handling) at +91 6284318951.
            </Typography>
          </Section>
        </Box>
      </Container>
    </Box>
  )
}
