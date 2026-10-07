import { Box, Typography, Stack, Chip, TextField, InputAdornment, alpha } from '@mui/material'
import { brandColors } from '../../../theme'
import { FiSliders, FiStar, FiAward } from 'react-icons/fi'

export interface ServicePackage {
  id: string
  name: string
  duration: string
  price: string
  rawAmount: number
  desc: string
}

interface StepChoosePlanProps {
  services: ServicePackage[]
  selectedService: string
  customAmount?: number
  customNote?: string
  onSelectService: (serviceId: string) => void
  onChangeCustomAmount?: (amount: number) => void
  onChangeCustomNote?: (note: string) => void
}

export function StepChoosePlan({
  services,
  selectedService,
  customAmount = 100,
  customNote = '',
  onSelectService,
  onChangeCustomAmount,
  onChangeCustomNote,
}: StepChoosePlanProps) {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1, color: brandColors.text, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        Which service package or plan upgrade do you need?
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>
        Select a standard package below or choose the custom amount / plan upgrade option to pay any custom amount.
      </Typography>

      <Stack spacing={2}>
        {services.map(s => {
          const isSelected = selectedService === s.id
          const isCustom = s.id === 'custom-amount'
          const isBestSeller = s.id === 'branding-network'

          return (
            <Box
              key={s.id}
              onClick={() => onSelectService(s.id)}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: '16px',
                border: isBestSeller
                  ? (isSelected ? '2px solid #7C3AED' : '2px solid rgba(124, 58, 237, 0.4)')
                  : `2px solid ${isSelected ? brandColors.primary : brandColors.border}`,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative',
                backgroundColor: isBestSeller
                  ? (isSelected ? 'rgba(124, 58, 237, 0.05)' : '#FAFAFE')
                  : (isSelected ? alpha(brandColors.primary, 0.03) : '#fff'),
                boxShadow: isBestSeller
                  ? (isSelected ? '0 12px 32px rgba(124, 58, 237, 0.18)' : '0 4px 16px rgba(124, 58, 237, 0.08)')
                  : (isSelected ? '0 4px 16px rgba(10, 102, 194, 0.08)' : 'none'),
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                '&:hover': {
                  borderColor: isBestSeller ? '#7C3AED' : brandColors.primary,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ maxWidth: { xs: '100%', sm: '70%' }, display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  {isCustom && (
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.2, flexShrink: 0 }}>
                      <FiSliders size={16} />
                    </Box>
                  )}
                  {isBestSeller && (
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: 'linear-gradient(135deg, #7C3AED, #2563EB)', color: '#FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.2, flexShrink: 0, boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}>
                      <FiStar size={16} fill="#FDE047" />
                    </Box>
                  )}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: isBestSeller ? '#1E1B4B' : brandColors.text }}>
                        {s.name}
                      </Typography>
                      {isBestSeller && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.2,
                            py: 0.25,
                            borderRadius: '100px',
                            background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                            color: '#fff',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)',
                          }}
                        >
                          <FiStar size={10} fill="#FDE047" color="#FDE047" />
                          <span>BEST SELLER</span>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: isBestSeller ? '#475569' : brandColors.muted, fontSize: '0.825rem', mt: 0.3 }}>
                      {s.desc}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={isCustom ? `₹${customAmount || 0}` : s.price}
                  sx={{
                    background: isBestSeller
                      ? (isSelected ? 'linear-gradient(135deg, #7C3AED, #2563EB)' : alpha('#7C3AED', 0.12))
                      : (isSelected ? brandColors.primary : alpha(brandColors.primary, 0.1)),
                    color: isBestSeller
                      ? (isSelected ? '#fff' : '#7C3AED')
                      : (isSelected ? '#fff' : brandColors.primary),
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    px: 1,
                    border: isBestSeller && !isSelected ? '1px solid rgba(124, 58, 237, 0.3)' : 'none',
                  }}
                />
              </Box>

              {/* Inline Custom Amount and Note Editor when custom-amount is selected */}
              {isCustom && isSelected && (
                <Box
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    border: `1px solid ${brandColors.border}`,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <Box sx={{ width: { xs: '100%', sm: '40%' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, display: 'block', mb: 0.5 }}>
                      Custom Amount (₹) *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={customAmount}
                      onChange={(e) => onChangeCustomAmount && onChangeCustomAmount(Math.max(1, parseInt(e.target.value, 10) || 0))}
                      inputProps={{ min: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontWeight: 700, color: brandColors.primary }}>₹</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontWeight: 700 } }}
                    />
                  </Box>

                  <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, display: 'block', mb: 0.5 }}>
                      Upgrade Reason / Note
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={customNote}
                      onChange={(e) => onChangeCustomNote && onChangeCustomNote(e.target.value)}
                      placeholder="e.g. Upgrading from ₹249 to ₹349 plan"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
