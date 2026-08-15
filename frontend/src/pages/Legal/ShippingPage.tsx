import { Box, Container, Typography, Alert } from '@mui/material'
import { brandColors } from '../../theme'
import { FiTruck } from 'react-icons/fi'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
      <Typography variant="h5" sx={{ mb: 1.5, color: brandColors.text, fontWeight: 700 }}>{title}</Typography>
      {children}
    </Box>
  )
}

export default function ShippingPage() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ mb: 1.5, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Shipping & Service Delivery Policy</Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted, mb: 4 }}>Last updated: August 2026</Typography>

        <Alert icon={<FiTruck size={22} />} severity="info" sx={{ mb: 5, borderRadius: '16px', fontWeight: 600, fontSize: '0.95rem' }}>
          Digital Service Notice: BrandIt operates as a digital career consulting firm (Legal Entity: <strong>RAGHAV DHIR</strong>). All deliverables are delivered electronically. No physical shipping of goods is required.
        </Alert>

        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff' }}>
          <Section title="1. Digital Service Delivery Mode">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              BrandIt provides digital personal branding, LinkedIn profile optimization, content creation, and career advisory services. Deliverables (including profile audits, banner graphics, monthly content calendars, and strategy guides) are delivered electronically to the customer’s registered email address and client dashboard. Live 1-on-1 advisory sessions are conducted via Google Meet video conference.
            </Typography>
          </Section>

          <Section title="2. Service Delivery Timeline & Duration">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted, mb: 1 }}>
              Service delivery timelines depend on the specific package purchased:
            </Typography>
            <Typography variant="body1" component="div" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              • <strong>Profile Setup & Advice (₹99)</strong>: Complete structural profile audit and actionable growth advice delivered via email within <strong>2 to 3 business days</strong>.<br />
              • <strong>Personal Branding (₹320/mo)</strong>: Profile setup completed within 3 days; monthly content calendar (8 posts/mo) delivered in weekly batches starting within <strong>3 to 5 business days</strong>.<br />
              • <strong>Network Growth Engine (₹400/mo)</strong>: Full setup, 8 monthly posts, and cold messaging strategy initiated within <strong>3 to 5 business days</strong>.<br />
              • <strong>LinkedIn Consulting (₹250/mo)</strong>: 1-on-1 strategy sessions scheduled within <strong>24 to 48 hours</strong> of booking based on client availability.
            </Typography>
          </Section>

          <Section title="3. Shipping Charges">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              Since all service deliverables are transmitted digitally via email, cloud links, and video conferencing, there are zero (₹0) shipping or handling fees applied to any order.
            </Typography>
          </Section>

          <Section title="4. Delayed Delivery Resolution">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              If you have not received your digital deliverables or session scheduling invitation within the specified delivery duration, please check your spam folder or contact our support team immediately at brandit.get@gmail.com or +91 8708231539. We guarantee instant assistance.
            </Typography>
          </Section>

          <Section title="5. Contact Information">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              <strong>Legal Entity / Proprietary Owner:</strong> RAGHAV DHIR (Trade Name: BrandIt)<br />
              <strong>Operating Address:</strong> DeraBassi, Punjab, 140507, India<br />
              <strong>Support Email:</strong> brandit.get@gmail.com<br />
              <strong>Phone / WhatsApp:</strong> +91 8708231539 / +91 6284318951
            </Typography>
          </Section>
        </Box>
      </Container>
    </Box>
  )
}
