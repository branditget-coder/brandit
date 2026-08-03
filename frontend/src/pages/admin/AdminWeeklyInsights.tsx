import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Paper, Chip, alpha, TextField, InputAdornment,
  CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel,
  Alert, Snackbar, Tooltip, Card, CardContent
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiSend, FiUsers, FiCheckCircle, FiClock, FiSearch, FiTrash2,
  FiEye, FiZap, FiFileText, FiRefreshCw, FiX, FiCheck
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface SubscriberItem {
  id: number
  email: string
  active: boolean
  subscribedAt: string
}

interface BroadcastResult {
  totalSubscribers: number
  sentCount: number
  statusMessage: string
  dispatchedAt: string
}

const PRESET_INSIGHTS = [
  {
    id: 'linkedin_hacks',
    title: '5 LinkedIn Personal Branding Hacks for 2026',
    subject: '🚀 BrandIt Weekly Insights: 5 LinkedIn Personal Branding Strategies for 2026',
    contentHtml: `<h3 style="color:#0A66C2; margin-top:0;">This Week's Executive Career Blueprint</h3>
<p>Building an authoritative personal brand is the highest-ROI asset for senior professionals, managers, and founders in 2026.</p>
<ul>
  <li><strong>1. Optimize your Headline for Search:</strong> Use Target Role + Core Expertise + Tangible Metric (e.g. <em>VP of Product | Scaling SaaS Platforms to $50M ARR</em>).</li>
  <li><strong>2. Leverage the Featured Section:</strong> Pin your top-performing posts, press mentions, and case studies to convert profile visits into inbound opportunities.</li>
  <li><strong>3. Write High-Hook Posts:</strong> Start your LinkedIn posts with strong problem statements. Avoid generic fluff.</li>
  <li><strong>4. Engage with Industry Leaders:</strong> Leave thoughtful, value-add comments on top voice posts in your niche.</li>
  <li><strong>5. Quantify Your Experience:</strong> Use the Google X-Y-Z formula: <em>Accomplished [X], as measured by [Y], by doing [Z]</em>.</li>
</ul>
<p style="margin-top:16px;">Want a 1-on-1 audit of your LinkedIn profile and executive resume? Book a strategy session with BrandIt lead consultants!</p>`
  },
  {
    id: 'resume_ats',
    title: 'Executive Resume Power Keywords & ATS Checklist',
    subject: '📄 Weekly Insights: Executive Resume Optimization & ATS Pass Rates',
    contentHtml: `<h3 style="color:#0A66C2; margin-top:0;">Executive Resume Power Keywords & ATS Checklist</h3>
<p>Over 85% of executive resumes fail automated Applicant Tracking Systems (ATS) due to formatting errors and weak action verbs.</p>
<ul>
  <li><strong>1. Strip Out Tables & Headers:</strong> ATS parsers frequently skip text embedded inside complex multi-column tables or header/footer boxes.</li>
  <li><strong>2. Use High-Impact Power Verbs:</strong> Replace <em>"responsible for"</em> with <em>Spearheaded, Architected, Accelerated, Negotiated, Cultivated</em>.</li>
  <li><strong>3. Align Core Competencies:</strong> Include specific tech stacks, leadership frameworks, and industry terminology matching your target JD.</li>
  <li><strong>4. Keep Length to 2 Pages Max:</strong> Even for 15+ years experience, prioritize your last 10 years of measurable achievements.</li>
</ul>`
  },
  {
    id: 'salary_negotiation',
    title: 'Salary & Promotion Negotiation Blueprint',
    subject: '💡 Weekly Insights: How to Negotiate a 30%+ Executive Pay Raise',
    contentHtml: `<h3 style="color:#0A66C2; margin-top:0;">Salary & Executive Compensation Negotiation Blueprint</h3>
<p>Never accept an initial job offer or annual review without presenting a structured Value Impact Portfolio.</p>
<ul>
  <li><strong>1. Anchoring on Market Benchmark Data:</strong> Research verified compensation brackets via Levels.fyi and executive recruiters.</li>
  <li><strong>2. Quantify Revenue & Cost Impact:</strong> Frame your request around the pipeline revenue, cost savings, or key projects you delivered.</li>
  <li><strong>3. Negotiate Non-Salary Equity & Bonuses:</strong> If base salary budget is capped, negotiate signing bonuses, stock options, remote flexibility, or learning stipends.</li>
</ul>`
  }
]

export default function AdminWeeklyInsights() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  // Broadcast Form State
  const [selectedPreset, setSelectedPreset] = useState<string>('linkedin_hacks')
  const [subject, setSubject] = useState<string>(PRESET_INSIGHTS[0].subject)
  const [contentHtml, setContentHtml] = useState<string>(PRESET_INSIGHTS[0].contentHtml)
  const [sending, setSending] = useState<boolean>(false)
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)

  // Notification Toast
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const fetchSubscribers = async () => {
    try {
      const res = await api.get<SubscriberItem[]>('/admin/newsletter/subscribers')
      if (res.data) {
        setSubscribers(res.data)
      }
    } catch (err: any) {
      // Soft fallback if endpoint fails
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId)
    const found = PRESET_INSIGHTS.find(p => p.id === presetId)
    if (found) {
      setSubject(found.subject)
      setContentHtml(found.contentHtml)
    }
  }

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !contentHtml.trim()) {
      setSnackbar({ open: true, message: 'Please provide both Subject and Content HTML.', severity: 'error' })
      return
    }

    setSending(true)
    try {
      const res = await api.post<BroadcastResult>('/admin/newsletter/broadcast', {
        subject,
        contentHtml,
        presetId: selectedPreset
      })
      const data = res.data
      setSnackbar({
        open: true,
        message: data.statusMessage || `Insights sent to ${data.sentCount} active accounts!`,
        severity: 'success'
      })
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to dispatch weekly insights broadcast.'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setSending(false)
    }
  }

  const handleToggleSubscriber = async (id: number) => {
    try {
      await api.patch(`/admin/newsletter/subscribers/${id}/toggle`)
      setSnackbar({ open: true, message: 'Subscriber status updated.', severity: 'success' })
      await fetchSubscribers()
    } catch (err: any) {
      setSnackbar({ open: true, message: 'Failed to update subscriber status.', severity: 'error' })
    }
  }

  const handleDeleteSubscriber = async (id: number) => {
    try {
      await api.delete(`/admin/newsletter/subscribers/${id}`)
      setSnackbar({ open: true, message: 'Subscriber unsubscribed successfully.', severity: 'success' })
      await fetchSubscribers()
    } catch (err: any) {
      setSnackbar({ open: true, message: 'Failed to delete subscriber.', severity: 'error' })
    }
  }

  const activeCount = subscribers.filter(s => s.active).length
  const filteredSubscribers = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Career Weekly Insights Broadcast</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>
            Automatically & manually dispatch weekly career, resume, and personal branding insights to opted-in accounts.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card sx={{ borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary }}>
                <FiUsers size={24} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.04em' }}>OPTED-IN ACCOUNTS</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{subscribers.length}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha('#059669', 0.1), color: '#059669' }}>
                <FiCheckCircle size={24} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.04em' }}>ACTIVE SUBSCRIBERS</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669' }}>{activeCount}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha('#7C3AED', 0.1), color: '#7C3AED' }}>
                <FiClock size={24} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.04em' }}>AUTO SCHEDULER</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#7C3AED' }}>Mondays @ 9:00 AM IST</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Composer Panel */}
        <Paper sx={{ p: 4, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FiZap size={22} color={brandColors.primary} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Compose & Broadcast Career Insights</Typography>
            </Box>
            <Button variant="outlined" startIcon={<FiRefreshCw size={14} />} onClick={fetchSubscribers} size="small" sx={{ borderRadius: '8px' }}>
              Refresh Subscribers ({activeCount})
            </Button>
          </Box>

          <form onSubmit={handleBroadcastSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Preset Selector */}
              <FormControl fullWidth size="small">
                <InputLabel id="preset-label">Select Career Insight Preset Topic</InputLabel>
                <Select
                  labelId="preset-label"
                  label="Select Career Insight Preset Topic"
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                >
                  {PRESET_INSIGHTS.map((preset) => (
                    <MenuItem key={preset.id} value={preset.id}>{preset.title}</MenuItem>
                  ))}
                  <MenuItem value="custom">✏️ Custom Draft</MenuItem>
                </Select>
              </FormControl>

              {/* Subject Input */}
              <TextField
                label="Email Subject Line"
                fullWidth
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. 🚀 BrandIt Weekly Insights: Executive Personal Branding Blueprint"
              />

              {/* Content Editor */}
              <TextField
                label="Insight Body Content (HTML Supported)"
                fullWidth
                required
                multiline
                rows={10}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                helperText="HTML formatting tags like <h3>, <p>, <ul>, <li>, <strong> are supported."
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FiEye size={16} />}
                  onClick={() => setPreviewOpen(true)}
                  sx={{ borderRadius: '10px', px: 3, fontWeight: 600 }}
                >
                  Live Preview Template
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={sending || activeCount === 0}
                  startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <FiSend size={18} />}
                  sx={{ borderRadius: '10px', px: 4, py: 1.2, fontWeight: 700 }}
                >
                  {sending ? 'Broadcasting...' : `Send Career Weekly Insights to ${activeCount} Account(s)`}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>

        {/* Opted-in Accounts Table */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Opted-In Accounts List ({subscribers.length})</Typography>
            <Typography variant="body2" sx={{ color: brandColors.muted }}>View and manage user accounts subscribed to receive Weekly Career Insights.</Typography>
          </Box>
          <TextField
            placeholder="Search email..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><FiSearch size={16} color={brandColors.muted} /></InputAdornment> }}
            sx={{ width: 260, '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflowX: 'auto' }}>
            <Box sx={{ minWidth: 650 }}>
              {/* Header */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1.5fr 1fr', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
                {['Subscribed Email', 'Subscribed Date', 'Opt-In Status', 'Actions'].map(h => (
                  <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
                ))}
              </Box>

              {/* Rows */}
              {filteredSubscribers.length === 0 ? (
                <Box sx={{ p: 5, textAlign: 'center' }}>
                  <FiUsers size={32} color={brandColors.muted} style={{ marginBottom: 12 }} />
                  <Typography variant="h6" sx={{ color: brandColors.text, mb: 0.5 }}>No opted-in accounts match your search</Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted }}>Users can subscribe via the website newsletter form or registration preferences.</Typography>
                </Box>
              ) : (
                filteredSubscribers.map((sub, i) => {
                  const formattedDate = sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
                  return (
                    <Box key={sub.id} sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1.5fr 1fr', gap: 2, px: 3, py: 2.5, borderBottom: i < filteredSubscribers.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{sub.email}</Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>{formattedDate}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={sub.active}
                              onChange={() => handleToggleSubscriber(sub.id)}
                              color="primary"
                            />
                          }
                          label={
                            <Chip
                              label={sub.active ? 'Opted In' : 'Disabled'}
                              size="small"
                              sx={{
                                backgroundColor: alpha(sub.active ? '#059669' : brandColors.muted, 0.1),
                                color: sub.active ? '#059669' : brandColors.muted,
                                fontWeight: 700,
                                fontSize: '0.68rem'
                              }}
                            />
                          }
                        />
                      </Box>

                      <Tooltip title="Unsubscribe Account">
                        <IconButton size="small" onClick={() => handleDeleteSubscriber(sub.id)} sx={{ color: brandColors.muted, '&:hover': { color: '#EF4444' }, width: 'fit-content' }}>
                          <FiTrash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )
                })
              )}
            </Box>
          </Paper>
        )}
      </motion.div>

      {/* LIVE PREVIEW DIALOG */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${brandColors.border}` }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Weekly Insights Email Template Preview</Typography>
          <IconButton onClick={() => setPreviewOpen(false)} size="small"><FiX /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4, backgroundColor: '#F3F4F6' }}>
          <Box sx={{ maxWidth: 600, mx: 'auto', backgroundColor: '#FFFFFF', borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <Box sx={{ background: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)', p: 3, textAlign: 'center', color: '#fff' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', m: 0 }}>BrandIt Consulting</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>Your Profile, Your Brand, Your Opportunity</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: '#111827', fontWeight: 800, mb: 1 }}>🚀 BrandIt Weekly Career Insights</Typography>
              <Typography variant="caption" sx={{ color: '#4B5563', display: 'block', mb: 2 }}>Exclusive personal branding, executive resume, and LinkedIn growth digest.</Typography>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </Paper>
              <Box sx={{ mt: 3, p: 2, textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0A66C2', mb: 1 }}>Ready to fast-track your executive career?</Typography>
                <Button variant="contained" color="primary" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>
                  Book 1-on-1 Consultation &rarr;
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
        </DialogActions>
      </Dialog>

      {/* TOAST SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
