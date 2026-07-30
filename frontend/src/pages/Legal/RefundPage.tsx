import { Box, Container, Typography, Alert } from '@mui/material'
import { brandColors } from '../../theme'
import { FiShieldOff } from 'react-icons/fi'

export default function RefundPage() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ mb: 1.5, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Non-Refundable Policy</Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted, mb: 4 }}>Last updated: July 2026</Typography>

        <Alert icon={<FiShieldOff size={22} />} severity="warning" sx={{ mb: 5, borderRadius: '16px', fontWeight: 600, fontSize: '0.95rem' }}>
          Strict Policy Notice: All transactions, service packages, upfront fees, and monthly subscriptions at BrandIt are 100% NON-REFUNDABLE.
        </Alert>

        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff' }}>
          {[
            {
              title: '1. Strict Non-Refundable Policy',
              body: 'All payments made to BrandIt for Profile Setup (₹99), Personal Branding (₹320/mo), Network Growth Engine (₹400/mo), and LinkedIn Consulting (₹250/mo) are final and non-refundable. Once a payment is processed, work begins immediately and bandwidth is reserved.'
            },
            {
              title: '2. No Chargebacks or Reversals',
              body: 'Clients agree not to initiate chargebacks, dispute transactions, or request payment reversals with banks or payment gateways (Stripe/Razorpay). Any unauthorized chargeback will be contested with full documentation of service agreement.'
            },
            {
              title: '3. Monthly Subscription Cancellation',
              body: 'For recurring monthly programs (₹320/mo, ₹400/mo, ₹250/mo), clients may cancel upcoming renewal cycles at any time before the next billing date. However, payments for the current billing cycle already charged will not be refunded.'
            },
            {
              title: '4. Service Deliverables & Revisions',
              body: 'If you are not satisfied with specific post copy or profile suggestions, our team will work with you to revise and align content within the scope of your purchased service package.'
            },
            {
              title: '5. Contact Support',
              body: 'For any questions or clarification regarding your account, please reach out to our Customer Handling team (Kritika Dhawan: +91 6284318951) or email brandit.get@gmail.com.'
            },
          ].map(s => (
            <Box key={s.title} sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
              <Typography variant="h5" sx={{ mb: 1.5, color: brandColors.text, fontWeight: 700 }}>{s.title}</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: brandColors.muted, fontSize: '0.95rem' }}>{s.body}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
