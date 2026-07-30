import { useState } from 'react'
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Chip, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiPlus, FiMinus, FiShield, FiHelpCircle } from 'react-icons/fi'
import { brandColors } from '../../theme'

const primaryFaqs = [
  {
    q: 'What is your Refund Policy for all payments & services?',
    a: 'All transactions, upfront payments, and monthly subscriptions at BrandIt are strictly 100% Non-Refundable under any circumstances. Once a service or plan is purchased, our consulting, writing, and outreach resources are allocated immediately.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, UPI, Net Banking, Razorpay, and Stripe payments. Subscriptions are billed transparently with zero hidden fees.',
  },
  {
    q: 'Are there any hidden costs or recurring setup charges?',
    a: 'No. Pricing is completely transparent. Profile Setup + Account Building Advice is a flat one-time ₹99 fee. Monthly programs (₹320/mo, ₹400/mo, ₹250/mo) are fixed monthly rates.',
  },
  {
    q: 'How does the ₹250/month LinkedIn Consulting pricing work?',
    a: 'The base rate for 1-on-1 strategic consulting starts at ₹250/month. Pricing amendments can be made depending on how frequently you request strategic sessions or personal brand coaching.',
  },
]

const secondaryFaqs = [
  {
    q: 'How fast will my profile setup and branding posts begin?',
    a: 'Your profile audit and initial setup suggestions are delivered within 48 to 72 hours of onboarding. Content calendars and post publishing begin immediately following strategy approval.',
  },
  {
    q: 'What is included in the ₹400/month Outreach Engine plan?',
    a: 'You get full profile setup, 8 strategy-backed posts/month, plus dedicated cold messaging, targeted connection outreach, and follow-up management to land opportunities.',
  },
  {
    q: 'Who will be handling my account and consulting?',
    a: 'Your account will be managed by our specialized team including Hritika Seth (LinkedIn Manager & Consultant), Kritika Dhawan (Outreach & Operations), and Raghav Dhir (Tech Support).',
  },
]

export default function FAQSection() {
  const [expanded, setExpanded] = useState<string | false>('p-0')

  return (
    <Box sx={{ py: { xs: 8, md: 14 }, backgroundColor: '#fff' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 1.5, letterSpacing: '0.1em', fontWeight: 700 }}>
              HELP & TRANSPARENCY
            </Typography>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Frequently Asked{' '}
              <Box component="span" sx={{ color: brandColors.primary }}>
                Questions
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, maxWidth: 480, mx: 'auto' }}>
              Clear answers regarding pricing, payments, non-refundable policies, and service delivery.
            </Typography>
          </Box>
        </motion.div>

        {/* PRIMARY FAQS: PRICING & POLICIES */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FiShield size={18} color={brandColors.primary} />
            <Typography variant="h6" sx={{ color: brandColors.text, fontWeight: 700 }}>
              Primary: Pricing, Payments & Non-Refund Policy
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {primaryFaqs.map((faq, i) => {
              const id = `p-${i}`
              const isExpanded = expanded === id
              return (
                <Accordion
                  key={id}
                  expanded={isExpanded}
                  onChange={() => setExpanded(isExpanded ? false : id)}
                  sx={{
                    borderRadius: '16px !important',
                    border: `1.5px solid ${isExpanded ? brandColors.primary : brandColors.border}`,
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    backgroundColor: isExpanded ? alpha(brandColors.primary, 0.02) : '#fff',
                  }}
                >
                  <AccordionSummary
                    expandIcon={isExpanded ? <FiMinus size={18} color={brandColors.primary} /> : <FiPlus size={18} color={brandColors.muted} />}
                    sx={{ px: 3, py: 1 }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.text, pr: 2 }}>
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.8 }}>
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        </Box>

        {/* SECONDARY FAQS: SERVICES & PROCESS */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FiHelpCircle size={18} color={brandColors.muted} />
            <Typography variant="h6" sx={{ color: brandColors.text, fontWeight: 700 }}>
              Secondary: Services & Execution
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {secondaryFaqs.map((faq, i) => {
              const id = `s-${i}`
              const isExpanded = expanded === id
              return (
                <Accordion
                  key={id}
                  expanded={isExpanded}
                  onChange={() => setExpanded(isExpanded ? false : id)}
                  sx={{
                    borderRadius: '16px !important',
                    border: `1px solid ${isExpanded ? brandColors.primary : brandColors.border}`,
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    backgroundColor: isExpanded ? alpha(brandColors.primary, 0.02) : '#fff',
                  }}
                >
                  <AccordionSummary
                    expandIcon={isExpanded ? <FiMinus size={18} color={brandColors.primary} /> : <FiPlus size={18} color={brandColors.muted} />}
                    sx={{ px: 3, py: 0.5 }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.text, pr: 2 }}>
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.8 }}>
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
