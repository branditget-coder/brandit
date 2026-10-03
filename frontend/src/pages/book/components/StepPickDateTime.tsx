import { Box, Typography, Chip, CircularProgress, Alert, alpha } from '@mui/material'
import { FiLock } from 'react-icons/fi'
import { brandColors } from '../../../theme'
import { ServicePackage } from './StepChoosePlan'

interface StepPickDateTimeProps {
  selectedServiceObj?: ServicePackage
  dates: Date[]
  timeSlots: string[]
  selectedDate: string
  selectedTime: string
  loadingSlots: boolean
  isSlotBooked: (dateStr: string, timeStr: string) => boolean
  isDateFullyBooked: (dateStr: string) => boolean
  onSelectDate: (dateStr: string) => void
  onSelectTime: (timeStr: string) => void
}

export function StepPickDateTime({
  selectedServiceObj,
  dates,
  timeSlots,
  selectedDate,
  selectedTime,
  loadingSlots,
  isSlotBooked,
  isDateFullyBooked,
  onSelectDate,
  onSelectTime
}: StepPickDateTimeProps) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Choose consultation date & time
        </Typography>
        {selectedServiceObj && (
          <Chip
            label={`Selected: ${selectedServiceObj.price}`}
            size="small"
            sx={{ backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 700 }}
          />
        )}
      </Box>

      {/* Available Dates */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mb: 1.5 }}>
          Available Dates
        </Typography>
        {loadingSlots ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
            <CircularProgress size={18} color="primary" />
            <Typography variant="caption" sx={{ color: brandColors.muted }}>Checking live slot availability...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
            {dates.map(d => {
              const label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
              const isFullyBooked = isDateFullyBooked(label)
              const isSelected = selectedDate === label

              return (
                <Box
                  key={label}
                  onClick={() => onSelectDate(label)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '10px',
                    border: `1.5px solid ${
                      isFullyBooked ? '#E2E8F0' : isSelected ? brandColors.primary : brandColors.border
                    }`,
                    cursor: isFullyBooked ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isFullyBooked ? '#F8FAFC' : isSelected ? alpha(brandColors.primary, 0.06) : '#fff',
                    color: isFullyBooked ? '#94A3B8' : isSelected ? brandColors.primary : brandColors.text,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    opacity: isFullyBooked ? 0.6 : 1,
                  }}
                >
                  {isFullyBooked && <FiLock size={13} color="#94A3B8" />}
                  <span>{label}</span>
                  {isFullyBooked && (
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 600 }}>
                      (Full)
                    </Typography>
                  )}
                </Box>
              )
            })}
          </Box>
        )}
      </Box>

      {/* Available Times (IST) */}
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mb: 1.5 }}>
          Available Times (IST) {selectedDate ? `for ${selectedDate}` : ''}
        </Typography>

        {!selectedDate ? (
          <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '0.85rem' }}>
            Please select an available date above first to view time slots.
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
            {timeSlots.map(t => {
              const isBooked = isSlotBooked(selectedDate, t)
              const isSelected = selectedTime === t

              return (
                <Box
                  key={t}
                  onClick={() => onSelectTime(t)}
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: '10px',
                    border: `1.5px solid ${
                      isBooked ? '#E2E8F0' : isSelected ? brandColors.primary : brandColors.border
                    }`,
                    cursor: isBooked ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isBooked ? '#F1F5F9' : isSelected ? alpha(brandColors.primary, 0.06) : '#fff',
                    color: isBooked ? '#94A3B8' : isSelected ? brandColors.primary : brandColors.text,
                    textDecoration: isBooked ? 'line-through' : 'none',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    opacity: isBooked ? 0.65 : 1,
                  }}
                >
                  {isBooked && <FiLock size={13} color="#94A3B8" />}
                  <span>{t}</span>
                  {isBooked && (
                    <Chip
                      label="Booked"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: '#EF4444',
                        color: '#fff',
                        ml: 0.5,
                      }}
                    />
                  )}
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}
