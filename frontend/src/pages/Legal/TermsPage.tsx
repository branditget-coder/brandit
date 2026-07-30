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

export function TermsPage() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ mb: 1.5, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Terms of Service</Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted, mb: 4 }}>Last updated: July 2026</Typography>

        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff' }}>
          <Section title="1. Agreement to Terms">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              By accessing, browsing, or purchasing any service package from BrandIt (brandit.in), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree, please do not use our services.
            </Typography>
          </Section>

          <Section title="2. Scope of Services">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              BrandIt provides specialized career personal branding, LinkedIn profile setup, content creation (8 posts/mo), network outreach execution, and 1-on-1 LinkedIn consulting. All deliverables and schedules are governed by the specific plan purchased (₹99, ₹320/mo, ₹400/mo, or ₹250/mo).
            </Typography>
          </Section>

          <Section title="3. Strictly Non-Refundable Payments">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              All fees and charges collected by BrandIt are strictly 100% non-refundable. Once a payment is completed, resources and strategist hours are immediately allocated. Clients agree not to dispute or initiate chargebacks for completed transactions.
            </Typography>
          </Section>

          <Section title="4. Account & Subscription Renewal">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              Monthly subscription plans (₹320/mo, ₹400/mo, ₹250/mo) renew on a 30-day recurring basis. Clients can request cancellation of upcoming renewal cycles at any time by contacting support prior to the renewal date.
            </Typography>
          </Section>

          <Section title="5. Intellectual Property & Deliverables">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              Upon full payment, all customized profile text, content calendars, and outreach scripts prepared specifically for you belong to you. BrandIt reserves the right to manage strategy execution as agreed.
            </Typography>
          </Section>

          <Section title="6. Contact & Dispute Resolution">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              For queries or support, please contact brandit.get@gmail.com or call Kritika Dhawan (Customer Handling) at +91 6284318951.
            </Typography>
          </Section>
        </Box>
      </Container>
    </Box>
  )
}

export default TermsPage
