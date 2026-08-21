import { Box, Typography, Stack, Chip, TextField, InputAdornment, alpha } from '@mui/material'
import { brandColors } from '../../../theme'
import { FiSliders } from 'react-icons/fi'

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
  customAmount = 70,
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

          return (
            <Box
              key={s.id}
              onClick={() => onSelectService(s.id)}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: '16px',
                border: `2px solid ${isSelected ? brandColors.primary : brandColors.border}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isSelected ? alpha(brandColors.primary, 0.03) : '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ maxWidth: { xs: '100%', sm: '70%' }, display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  {isCustom && (
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.2, flexShrink: 0 }}>
                      <FiSliders size={16} />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.text }}>{s.name}</Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted, fontSize: '0.825rem', mt: 0.3 }}>{s.desc}</Typography>
                  </Box>
                </Box>
                <Chip
                  label={isCustom ? `₹${customAmount || 0}` : s.price}
                  sx={{
                    backgroundColor: isSelected ? brandColors.primary : alpha(brandColors.primary, 0.1),
                    color: isSelected ? '#fff' : brandColors.primary,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    px: 1,
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
                      placeholder="e.g. Upgrading from ₹250 to ₹320 plan"
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
