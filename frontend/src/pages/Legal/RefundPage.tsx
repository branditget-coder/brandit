import { Box, Container, Typography, Alert } from '@mui/material'
import { brandColors } from '../../theme'
import { FiRefreshCw } from 'react-icons/fi'
import SEO from '../../components/common/SEO'

export default function RefundPage() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <SEO
        title="Refund & Cancellation Policy"
        description="BrandIt's official Refund, Return and Cancellation policies."
        canonicalUrl="https://go-brandit.vercel.app/refund"
      />
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ mb: 1.5, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Return, Refund & Cancellation Policy</Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted, mb: 4 }}>Last updated: August 2026</Typography>

        <Alert icon={<FiRefreshCw size={22} />} severity="info" sx={{ mb: 5, borderRadius: '16px', fontWeight: 600, fontSize: '0.95rem' }}>
          BrandIt is operated by <strong>RAGHAV DHIR</strong>. We strive for 100% satisfaction in our Personal Branding & Career Consulting Services. Below are our official Refund & Cancellation guidelines.
        </Alert>

        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff' }}>
          {[
            {
              title: '1. Cancellation Policy & Duration',
              body: 'Clients may request cancellation of any service package (Profile Setup ₹99, Personal Branding ₹320/mo, Growth Engine ₹400/mo, or Consulting ₹250/mo) within 24 hours of placing the order or at least 24 hours prior to a scheduled 1-on-1 consultation session. For monthly subscription programs, clients may cancel upcoming renewal cycles at any time before the billing date.'
            },
            {
              title: '2. Refund Request Duration & Eligibility',
              body: 'Refund requests must be submitted within 24 hours of transaction completion via email to brandit.get@gmail.com. If service execution (profile structural audit, content writing, or custom strategy roadmap) has not yet commenced, a full refund will be granted. Once custom strategy work or profile optimization has been delivered, partial refunds or service revisions will be evaluated on a case-by-case basis.'
            },
            {
              title: '3. Refund Mode & Processing Timeline',
              body: 'All approved refunds will be credited back to the customer’s original mode of payment (Credit Card, Debit Card, Net Banking, UPI, or Wallet) via PayU Payment Gateway. Refunds are processed within 5 to 7 working days from the date of refund approval.'
            },
            {
              title: '4. Service Revisions & Support Guarantee',
              body: 'If you are dissatisfied with specific post drafts, profile headline copy, or strategy blueprints, our team provides up to 2 rounds of complimentary revisions to ensure complete alignment with your career goals.'
            },
            {
              title: '5. Operating Address & Customer Contact',
              body: 'For any cancellation or refund inquiries, please contact our operating team:\n• Operating Legal Entity: RAGHAV DHIR (Trade Name: BrandIt)\n• Operating Address: DeraBassi, Punjab, 140507, India\n• Support Email: brandit.get@gmail.com\n• Phone / WhatsApp: +91 8708231539 / +91 6284318951'
            },
          ].map(s => (
            <Box key={s.title} sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
              <Typography variant="h5" sx={{ mb: 1.5, color: brandColors.text, fontWeight: 700 }}>{s.title}</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{s.body}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
