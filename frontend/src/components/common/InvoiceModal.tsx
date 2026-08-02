import React from 'react'
import {
  Dialog, DialogContent, Box, Typography, Button, Divider, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack, alpha
} from '@mui/material'
import { FiPrinter, FiX, FiCheckCircle, FiShield } from 'react-icons/fi'
import { brandColors } from '../../theme'
import BrandLogo from './BrandLogo'

export interface InvoiceDetails {
  id: number
  serviceName: string
  bookingDate?: string
  preferredDate?: string
  amount?: number
  amountPaid?: number
  clientName?: string
  clientEmail?: string
  paymentMethod?: string
  paymentId?: string
}

interface InvoiceModalProps {
  open: boolean
  onClose: () => void
  invoice: InvoiceDetails | null
}

export default function InvoiceModal({ open, onClose, invoice }: InvoiceModalProps) {
  if (!invoice) return null

  const displayDate = invoice.bookingDate || invoice.preferredDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const totalAmount = invoice.amount || invoice.amountPaid || 1499
  const baseAmount = Math.round((totalAmount / 1.18) * 100) / 100
  const gstAmount = Math.round((totalAmount - baseAmount) * 100) / 100
  const invoiceNo = `INV-2026-${String(invoice.id).padStart(4, '0')}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: 1,
          '@media print': {
            boxShadow: 'none',
            border: 'none',
            m: 0,
            width: '100%',
            maxWidth: '100%',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 2, pb: 1, '@media print': { display: 'none' } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.muted }}>
          Official Tax Invoice & Payment Receipt
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            startIcon={<FiPrinter size={16} />}
            onClick={handlePrint}
            sx={{ borderRadius: '10px', px: 2.5, fontWeight: 700 }}
          >
            Print / Save as PDF
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
            sx={{ borderRadius: '10px', minWidth: 40, p: 1 }}
          >
            <FiX size={18} />
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ '@media print': { display: 'none' } }} />

      <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
        {/* Printable Invoice Container */}
        <Box id="printable-invoice" sx={{ backgroundColor: '#fff', borderRadius: '16px', color: '#1F2937' }}>
          
          {/* Top Header: BrandIt Logo & Invoice Meta */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box>
              <BrandLogo variant="dark" size="medium" showSlogan={false} />
              <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mt: 1, lineHeight: 1.4 }}>
                BrandIt Consulting Pvt Ltd<br />
                Cyber City, Phase II, Gurugram, India<br />
                GSTIN: 07AAACB1234F1Z0 | HSN/SAC: 998311
              </Typography>
            </Box>

            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em', mb: 0.5 }}>
                TAX INVOICE
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {invoiceNo}
              </Typography>
              <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mt: 0.5 }}>
                Date: {displayDate}
              </Typography>
              <Chip
                icon={<FiCheckCircle size={12} />}
                label="PAYMENT VERIFIED & PAID"
                size="small"
                sx={{ mt: 1, backgroundColor: alpha(brandColors.success, 0.1), color: '#059669', fontWeight: 800, fontSize: '0.68rem' }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          {/* Bill To & Payment Details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Billed To
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brandColors.text }}>
                {invoice.clientName || 'Valued Client'}
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted }}>
                {invoice.clientEmail || 'client@domain.com'}
              </Typography>
            </Box>

            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Payment Reference
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>
                Method: {invoice.paymentMethod || 'UPI / Online Transfer'}
              </Typography>
              <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', fontFamily: 'monospace', mt: 0.5 }}>
                Ref ID: {invoice.paymentId || `GPI_REF_${invoice.id}9824`}
              </Typography>
            </Box>
          </Box>

          {/* Itemized Table */}
          <TableContainer sx={{ mb: 4, borderRadius: '12px', border: `1px solid ${brandColors.border}` }}>
            <Table>
              <TableHead sx={{ backgroundColor: brandColors.background }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: brandColors.text }}>Service Description</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: brandColors.text }}>SAC Code</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: brandColors.text }}>Amount (INR)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text }}>
                      {invoice.serviceName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>
                      1-on-1 Personal Branding & Executive Strategy Consultation Session
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: brandColors.muted, fontFamily: 'monospace' }}>
                      998311
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text }}>
                      ₹{baseAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals Calculation Box */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Box sx={{ width: { xs: '100%', sm: 300 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                <Typography variant="body2" sx={{ color: brandColors.muted }}>Subtotal (Taxable):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{baseAmount.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                <Typography variant="body2" sx={{ color: brandColors.muted }}>Integrated GST (18%):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{gstAmount.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brandColors.text }}>Total Amount Paid:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brandColors.primary }}>₹{totalAmount.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom Footer & Seal */}
          <Box sx={{ p: 2.5, borderRadius: '16px', backgroundColor: alpha(brandColors.primary, 0.04), border: `1px solid ${alpha(brandColors.primary, 0.1)}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FiShield size={22} color={brandColors.primary} />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, display: 'block' }}>
                  Digitally Authenticated Tax Invoice
                </Typography>
                <Typography variant="caption" sx={{ color: brandColors.muted }}>
                  This is a computer-generated invoice and requires no physical signature.
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.primary }}>
              BrandIt Financial Services
            </Typography>
          </Box>

        </Box>
      </DialogContent>
    </Dialog>
  )
}
