import { Box, Typography, Grid, Paper, Chip, Button, Divider, Stack, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiBookOpen, FiFileText, FiCheckSquare, FiAward, FiDownload, FiExternalLink } from 'react-icons/fi'
import { brandColors } from '../../theme'

const sops = [
  {
    title: 'LinkedIn Optimization Standard (SOP-01)',
    category: 'LinkedIn Strategy',
    version: 'v2.4',
    description: 'Guidelines for optimizing client headlines, featured sections, banner design alignment, and keyword density for maximum executive reach.',
    icon: FiAward,
    color: brandColors.primary,
  },
  {
    title: 'Client Onboarding & Intake Protocol (SOP-02)',
    category: 'Operations',
    version: 'v1.8',
    description: 'Step-by-step procedures for conducting initial 30-minute discovery calls, extracting founder story hooks, and setting milestone deliverables.',
    icon: FiCheckSquare,
    color: '#10B981',
  },
  {
    title: 'Executive Content Calendar Framework (SOP-03)',
    category: 'Content Creation',
    version: 'v3.0',
    description: 'Weekly posting schedules, hook writing frameworks, carousels vs text posts ratio, and engagement pod strategies.',
    icon: FiFileText,
    color: '#8B5CF6',
  },
  {
    title: 'Client Financial & Billing Procedures (SOP-04)',
    category: 'Accounting & Finance',
    version: 'v1.2',
    description: 'Invoicing standards, payment link generation, GST accounting compliance, and refund protocol.',
    icon: FiBookOpen,
    color: '#F59E0B',
  },
]

const templates = [
  { name: 'LinkedIn Profile Audit Scorecard (.xlsx)', type: 'Spreadsheet Template' },
  { name: 'Founder Positioning Discovery Questionnaire (.docx)', type: 'Document Template' },
  { name: 'Weekly Client Growth Report Template (.pdf)', type: 'Report Template' },
  { name: 'BrandIt Executive Content Swipe File 2026 (.pdf)', type: 'Swipe File' },
]

export default function TeamResources() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Chip label="INTERNAL PLAYBOOKS" sx={{ mb: 1, backgroundColor: alpha('#8B5CF6', 0.12), color: '#7C3AED', fontWeight: 800, fontSize: '0.75rem' }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
            Company SOPs & Resources
          </Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>
            Internal guidelines, playbooks, and standardized operating procedures for the BrandIt consulting team.
          </Typography>
        </Box>

        {/* Standard Operating Procedures (SOPs) Grid */}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5, color: brandColors.text }}>
          Standard Operating Procedures (SOPs)
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {sops.map((sop, i) => (
            <Grid item xs={12} md={6} key={sop.title}>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Paper
                  sx={{
                    p: 3.5,
                    borderRadius: '24px',
                    border: `1px solid ${brandColors.border}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: alpha(sop.color, 0.1), color: sop.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <sop.icon size={22} />
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Chip label={sop.category} size="small" sx={{ backgroundColor: alpha(sop.color, 0.08), color: sop.color, fontWeight: 700 }} />
                        <Chip label={sop.version} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                      </Stack>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text, mb: 1 }}>
                      {sop.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.6, mb: 3 }}>
                      {sop.description}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<FiExternalLink size={16} />}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderColor: brandColors.border,
                      color: brandColors.text,
                      '&:hover': { borderColor: sop.color, color: sop.color },
                    }}
                  >
                    Read Playbook
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Templates & Swipe Files */}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5, color: brandColors.text }}>
          Downloadable Templates & Client Assets
        </Typography>

        <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Stack spacing={2} divider={<Divider />}>
            {templates.map((tpl) => (
              <Box key={tpl.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiFileText size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brandColors.text }}>
                      {tpl.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>
                      {tpl.type}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<FiDownload size={14} />}
                  sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, borderColor: brandColors.border }}
                >
                  Download Asset
                </Button>
              </Box>
            ))}
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  )
}
