import { useState, ChangeEvent } from 'react'
import { Box, Typography, Grid, Paper, Button, alpha, Stack, Chip, TextField, CircularProgress, Alert, Divider } from '@mui/material'
import { motion } from 'framer-motion'
import { FiDownload, FiEye, FiCheck, FiUploadCloud, FiCpu, FiAward, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

const templates = [
  { id: 'modern', name: 'Modern Professional', desc: 'Clean, minimal design. Perfect for tech and startups.', popular: true },
  { id: 'executive', name: 'Executive Classic', desc: 'Traditional layout for senior roles and corporate positions.', popular: false },
  { id: 'creative', name: 'Creative Portfolio', desc: 'Bold design for designers, marketers, and creatives.', popular: false },
]

interface AIResult {
  overallScore: string
  strengths: string[]
  improvements: string[]
  rewrittenSummary: string
}

export default function ResumeBuilder() {
  const [selected, setSelected] = useState('modern')

  // AI Scanner state
  const [targetRole, setTargetRole] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiResult, setAiResult] = useState<AIResult | null>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
    }
  }

  const handleScanResume = async () => {
    if (!file && !resumeText.trim()) {
      setError('Please upload a PDF resume or paste your resume text.')
      return
    }

    setLoading(true)
    setError('')
    setAiResult(null)

    try {
      let res
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        if (targetRole) formData.append('targetRole', targetRole)

        res = await api.post('/ai/review-resume-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        res = await api.post('/ai/review-resume', {
          targetRole: targetRole || 'Senior Professional',
          resumeText
        })
      }
      setAiResult(res.data)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to scan resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>AI Resume Scanner & Builder</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Scan your resume with AI for instant ATS scoring or choose a premium template.</Typography>
        </Box>

        {/* AI Resume Scanner Section */}
        <Paper sx={{ p: 3.5, mb: 4, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.03)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: alpha(brandColors.primary, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCpu size={22} color={brandColors.primary} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: brandColors.text, fontWeight: 700 }}>AI Resume Scanner & ATS Optimizer</Typography>
              <Typography variant="caption" sx={{ color: brandColors.muted }}>Upload your PDF resume or paste text to receive executive AI analysis and score.</Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Role / Job Title"
                placeholder="e.g. Senior Product Manager, Lead Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                sx={{ mb: 2.5 }}
              />

              {/* Upload PDF Box */}
              <Box
                component="label"
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  p: 3, borderRadius: '16px', border: `2px dashed ${file ? brandColors.primary : brandColors.border}`,
                  bgcolor: file ? alpha(brandColors.primary, 0.03) : '#FAFBFD', cursor: 'pointer',
                  transition: 'all 0.2s', '&:hover': { borderColor: brandColors.primary, bgcolor: alpha(brandColors.primary, 0.04) },
                  mb: 2
                }}
              >
                <input type="file" accept=".pdf,.txt,.docx" hidden onChange={handleFileChange} />
                <FiUploadCloud size={32} color={file ? brandColors.primary : brandColors.muted} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mt: 1 }}>
                  {file ? file.name : 'Click to Upload PDF Resume'}
                </Typography>
                <Typography variant="caption" sx={{ color: brandColors.muted }}>
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports PDF, DOCX, TXT (Max 10MB)'}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', textAlign: 'center', mb: 2 }}>
                — OR PASTE TEXT BELOW —
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={!!file}
              />

              {error && <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>{error}</Alert>}

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiCpu size={18} />}
                onClick={handleScanResume}
                disabled={loading}
                sx={{ mt: 3, py: 1.5, borderRadius: '14px', fontWeight: 700 }}
              >
                {loading ? 'Analyzing Resume...' : 'Scan Resume with AI'}
              </Button>
            </Grid>

            {/* AI Results Output */}
            <Grid item xs={12} md={6}>
              {aiResult ? (
                <Paper sx={{ p: 3, borderRadius: '18px', border: `1px solid ${alpha(brandColors.primary, 0.2)}`, bgcolor: '#FAFCFF', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      AI Analysis Score
                    </Typography>
                    <Chip label={aiResult.overallScore} color="primary" sx={{ fontWeight: 800, fontSize: '0.9rem' }} />
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8, color: brandColors.success }}>
                    <FiAward size={16} /> Top Strengths
                  </Typography>
                  <Stack spacing={0.8} sx={{ mb: 2 }}>
                    {aiResult.strengths?.map((s, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <FiCheck size={14} color={brandColors.success} style={{ marginTop: 3 }} />
                        <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 500 }}>{s}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8, color: '#D97706' }}>
                    <FiTrendingUp size={16} /> Recommended Improvements
                  </Typography>
                  <Stack spacing={0.8} sx={{ mb: 2 }}>
                    {aiResult.improvements?.map((imp, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <FiAlertCircle size={14} color="#D97706" style={{ marginTop: 3 }} />
                        <Typography variant="caption" sx={{ color: brandColors.text }}>{imp}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: brandColors.text }}>
                    Suggested Executive Summary
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.muted, fontStyle: 'italic', display: 'block', bgcolor: '#fff', p: 2, borderRadius: '10px', border: `1px solid ${brandColors.border}` }}>
                    "{aiResult.rewrittenSummary}"
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ height: '100%', minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${brandColors.border}`, borderRadius: '18px', p: 3, textAlign: 'center', bgcolor: '#FAFBFD' }}>
                  <FiCpu size={40} color={brandColors.muted} style={{ marginBottom: 12 }} />
                  <Typography variant="body2" sx={{ color: brandColors.text, fontWeight: 600 }}>Your AI Scan Results Will Appear Here</Typography>
                  <Typography variant="caption" sx={{ color: brandColors.muted, maxWidth: 280, mt: 0.5 }}>Upload your file or paste your resume on the left and click "Scan Resume with AI".</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Templates Picker & Live Preview */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ mb: 2.5, color: brandColors.text }}>Choose Template</Typography>
              <Stack spacing={1.5}>
                {templates.map(t => (
                  <Box
                    key={t.id}
                    onClick={() => setSelected(t.id)}
                    sx={{
                      p: 2.5, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s',
                      border: `2px solid ${selected === t.id ? brandColors.primary : brandColors.border}`,
                      backgroundColor: selected === t.id ? alpha(brandColors.primary, 0.03) : '#fff',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{t.name}</Typography>
                      {t.popular && <Chip label="Popular" size="small" sx={{ bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700, fontSize: '0.65rem', height: 20 }} />}
                    </Box>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>{t.desc}</Typography>
                    {selected === t.id && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <FiCheck size={13} color={brandColors.primary} />
                        <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 600 }}>Selected</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>
                  {templates.find(t => t.id === selected)?.name} Preview
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button size="small" startIcon={<FiEye size={14} />} variant="outlined" sx={{ borderColor: brandColors.border, color: brandColors.text, '&:hover': { borderColor: brandColors.primary, color: brandColors.primary } }}>Preview</Button>
                  <Button size="small" startIcon={<FiDownload size={14} />} variant="contained">Download PDF</Button>
                </Box>
              </Box>

              <Box sx={{ p: 4, backgroundColor: brandColors.background, minHeight: 400 }}>
                <Box sx={{ maxWidth: 500, mx: 'auto', backgroundColor: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                  <Box sx={{ borderBottom: `3px solid ${brandColors.primary}`, pb: 2, mb: 3 }}>
                    <Typography variant="h4" sx={{ color: brandColors.text, mb: 0.25 }}>John Doe</Typography>
                    <Typography variant="body2" sx={{ color: brandColors.primary, fontWeight: 600, mb: 0.75 }}>
                      {targetRole || 'Senior Software Engineer'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>john.doe@email.com · +91 98765 43210 · Bengaluru, India</Typography>
                  </Box>
                  {['Summary', 'Experience', 'Education', 'Skills'].map(section => (
                    <Box key={section} sx={{ mb: 2.5 }}>
                      <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 1 }}>{section.toUpperCase()}</Typography>
                      <Box sx={{ height: 8, backgroundColor: brandColors.background, borderRadius: 2, mb: 0.75 }} />
                      <Box sx={{ height: 8, backgroundColor: brandColors.background, borderRadius: 2, width: '80%' }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}
