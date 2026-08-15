import { Box, Container, Typography, Alert } from '@mui/material'
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
        <Typography variant="h1" sx={{ mb: 1.5, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Terms & Conditions</Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>Last updated: August 2026</Typography>

        {/* Mandated PayU Verification Ownership Declaration */}
        <Alert severity="info" sx={{ mb: 4, borderRadius: '16px', fontWeight: 600, fontSize: '0.95rem' }}>
          This website (go-brandit.vercel.app / brandit.in) is owned and operated by <strong>RAGHAV DHIR</strong> under the trade name <strong>BrandIt</strong>.
        </Alert>

        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff' }}>
          <Section title="1. Agreement to Terms & Ownership Declaration">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted, mb: 1.5 }}>
              This website is operated by <strong>RAGHAV DHIR</strong> (Trade Name: <strong>BrandIt</strong>). Throughout the site, the terms "we", "us", and "our" refer to RAGHAV DHIR / BrandIt.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              By visiting our site or purchasing service packages from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms").
            </Typography>
          </Section>

          <Section title="2. Line of Business (LOB) & Services Scope">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              BrandIt operates strictly in a single Line of Business: <strong>Career & Personal Branding Consulting Services</strong>. Our offerings include LinkedIn profile setup & structural audit (₹99), monthly personal branding content publishing (₹320/mo), targeted network outreach campaign management (₹400/mo), and 1-on-1 strategic career advisory sessions (₹250/mo). All services are priced in Indian Rupees (INR).
            </Typography>
          </Section>

          <Section title="3. Pricing, Billing & Payment Processing">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              All prices are listed in INR. Payments are securely processed via authorized payment gateway partners (PayU / Stripe / Razorpay). By initiating a transaction, you authorize us to charge your selected payment instrument (Credit Card, Debit Card, Net Banking, UPI, or Wallet) for the agreed package amount.
            </Typography>
          </Section>

          <Section title="4. Refund, Cancellation & Delivery Policies">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              Service delivery schedules, refund durations, and cancellation terms are governed by our dedicated Refund & Cancellation Policy and Shipping & Service Delivery Policy. Deliverables are provided digitally via email and video conference within 2 to 5 business days of order confirmation.
            </Typography>
          </Section>

          <Section title="5. Client Conduct & Intellectual Property">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              Clients agree to provide accurate background details for profile optimization. Upon full payment, all customized profile text, content calendars, and outreach scripts prepared specifically for the client belong to the client.
            </Typography>
          </Section>

          <Section title="6. Business & Operating Contact Details">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              <strong>Proprietary Entity / Legal Name:</strong> RAGHAV DHIR<br />
              <strong>Trade Name:</strong> BrandIt<br />
              <strong>Line of Business:</strong> Career & Personal Branding Consulting Services<br />
              <strong>Operating / Registered Address:</strong> DeraBassi, Punjab, 140507, India<br />
              <strong>Email:</strong> brandit.get@gmail.com<br />
              <strong>Phone / Mobile:</strong> +91 8708231539 / +91 6284318951
            </Typography>
          </Section>

          <Section title="7. Governing Law">
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted }}>
              These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of India, subject to the exclusive jurisdiction of the courts in Punjab, India.
            </Typography>
          </Section>
        </Box>
      </Container>
    </Box>
  )
}

export default TermsPage
