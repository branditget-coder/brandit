import { Box, Typography, Stack, Chip, alpha } from '@mui/material'
import { brandColors } from '../../../theme'

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
  onSelectService: (serviceId: string) => void
}

export function StepChoosePlan({ services, selectedService, onSelectService }: StepChoosePlanProps) {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: brandColors.text, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        Which service package do you need?
      </Typography>
      <Stack spacing={2}>
        {services.map(s => (
          <Box
            key={s.id}
            onClick={() => onSelectService(s.id)}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: '16px',
              border: `2px solid ${selectedService === s.id ? brandColors.primary : brandColors.border}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: selectedService === s.id ? alpha(brandColors.primary, 0.03) : '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5
            }}
          >
            <Box sx={{ maxWidth: { xs: '100%', sm: '70%' } }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.text }}>{s.name}</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted, fontSize: '0.825rem', mt: 0.5 }}>{s.desc}</Typography>
            </Box>
            <Chip label={s.price} sx={{ backgroundColor: brandColors.primary, color: '#fff', fontWeight: 700, fontSize: '0.9rem', px: 1 }} />
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
