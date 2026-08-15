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
  FiEye, FiZap, FiFileText, FiRefreshCw, FiX, FiCheck, FiUserPlus
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
    id: 'linkedin_profile_tip',
    title: '3 Quick Ways to Improve Your LinkedIn Today',
    subject: '✨ This Week from BrandIt: 3 Easy LinkedIn Wins',
    contentHtml: `<p style="font-size:16px; color:#1E293B; margin-top:0;">Hi there! 👋</p>

<p style="color:#374151;">Here are <strong>3 simple things</strong> you can do right now to make your LinkedIn profile stand out:</p>

<p style="color:#374151;">🔵 <strong>1. Update your headline</strong><br>
Don't just write your job title. Add what you help people with.<br>
<em>Example: "Marketing Manager | Helping small businesses grow online"</em></p>

<p style="color:#374151;">🟢 <strong>2. Add a profile photo</strong><br>
Profiles with a clear, friendly photo get <strong>14x more views</strong>. Use a simple background and smile!</p>

<p style="color:#374151;">🟡 <strong>3. Write one post this week</strong><br>
Share something you learned recently — even 3-4 lines is enough. Consistency beats perfection.</p>

<hr style="border:none; border-top:1px solid #E5E7EB; margin:20px 0;" />

<p style="color:#6B7280; font-size:14px;">Need help with your LinkedIn or personal brand? 
<a href="https://brandit.get" style="color:#2563EB;">Book a free strategy call</a> with our team. 🚀</p>`,
  },
  {
    id: 'resume_basics',
    title: 'Make Your Resume Get Noticed (Simple Tips)',
    subject: '📄 This Week from BrandIt: Fix Your Resume in 10 Minutes',
    contentHtml: `<p style="font-size:16px; color:#1E293B; margin-top:0;">Hi there! 👋</p>

<p style="color:#374151;">Most resumes get skipped in under <strong>10 seconds</strong>. Here's how to fix that quickly:</p>

<p style="color:#374151;">✅ <strong>Start bullet points with action words</strong><br>
Instead of "Responsible for sales" → write "Grew sales by 30% in 6 months"</p>

<p style="color:#374151;">✅ <strong>Keep it to 1–2 pages</strong><br>
Recruiters don't read long resumes. Pick your best 5–6 achievements and highlight those.</p>

<p style="color:#374151;">✅ <strong>Use simple formatting</strong><br>
Avoid tables, columns, and fancy graphics. Clean text is easier to read — and works better with job portals.</p>

<p style="color:#374151;">✅ <strong>Add numbers wherever you can</strong><br>
"Managed a team" is weak. "Managed a team of 8 people and reduced delivery time by 20%" is strong.</p>

<hr style="border:none; border-top:1px solid #E5E7EB; margin:20px 0;" />

<p style="color:#6B7280; font-size:14px;">Want us to review your resume personally? 
<a href="https://brandit.get" style="color:#2563EB;">Book a session with BrandIt</a> — we'll guide you step by step.</p>`,
  },
  {
    id: 'career_confidence',
    title: 'How to Talk About Yourself (Without Feeling Awkward)',
    subject: '💬 This Week from BrandIt: Speak About Your Work with Confidence',
    contentHtml: `<p style="font-size:16px; color:#1E293B; margin-top:0;">Hi there! 👋</p>

<p style="color:#374151;">A lot of people find it hard to talk about their own work — especially in interviews or on LinkedIn. You're not alone!</p>

<p style="color:#374151;">Here's a simple way to introduce yourself that actually works:</p>

<p style="background:#F0F9FF; border-left:4px solid #2563EB; padding:12px 16px; border-radius:4px; color:#1E293B;">
<strong>"I help [type of person] do [what you help them with], so they can [benefit they get]."</strong>
</p>

<p style="color:#374151;"><em>Example: "I help small business owners build their online presence, so they can attract more customers without spending on ads."</em></p>

<p style="color:#374151;">Try writing your version of this sentence today. Use it on your LinkedIn headline, in your bio, or the next time someone asks "so what do you do?"</p>

<p style="color:#374151;">The more you say it, the more natural it feels. 💪</p>

<hr style="border:none; border-top:1px solid #E5E7EB; margin:20px 0;" />

<p style="color:#6B7280; font-size:14px;">Need help crafting your personal brand story? 
<a href="https://brandit.get" style="color:#2563EB;">Chat with the BrandIt team</a> — we make it simple.</p>`,
  },
  {
    id: 'job_search_tips',
    title: 'Job Search Feels Slow? Try This',
    subject: '🔍 This Week from BrandIt: Get More Responses from Job Applications',
    contentHtml: `<p style="font-size:16px; color:#1E293B; margin-top:0;">Hi there! 👋</p>

<p style="color:#374151;">If you've been applying to jobs and not hearing back, it can feel really discouraging. Here's what actually helps:</p>

<p style="color:#374151;">📌 <strong>Apply to fewer jobs, but better ones</strong><br>
Instead of applying to 50 jobs and copying the same resume, pick 10 that truly fit and tailor each application.</p>

<p style="color:#374151;">📌 <strong>Message the recruiter directly</strong><br>
After applying, send a short, polite message on LinkedIn saying you applied and you're genuinely interested. Most people don't do this — which means you'll stand out.</p>

<p style="color:#374151;">📌 <strong>Ask for referrals</strong><br>
If you know someone at the company — even casually — ask if they can pass your name along. A referral increases your chances by 5x.</p>

<p style="color:#374151;">📌 <strong>Follow up once (politely)</strong><br>
If you didn't hear back after 7 days, it's okay to follow up once. Keep it short and friendly.</p>

<hr style="border:none; border-top:1px solid #E5E7EB; margin:20px 0;" />

<p style="color:#6B7280; font-size:14px;">Want a personalized job search strategy? 
<a href="https://brandit.get" style="color:#2563EB;">Book a 1-on-1 session with BrandIt</a> and let's figure it out together.</p>`,
  },
]

export default function AdminWeeklyInsights() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  // Broadcast Form State
  const [selectedPreset, setSelectedPreset] = useState<string>('linkedin_profile_tip')
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

  // Backfill state
  const [backfilling, setBackfilling] = useState(false)

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

  const handleBackfillExistingUsers = async () => {
    setBackfilling(true)
    try {
      const res = await api.post<{ enrolled: number; totalUsers: number; message: string }>('/admin/newsletter/backfill')
      const { enrolled, message } = res.data
      setSnackbar({
        open: true,
        message: `✅ ${message}`,
        severity: enrolled > 0 ? 'success' : 'success'
      })
      await fetchSubscribers()
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Backfill failed. Please try again.', severity: 'error' })
    } finally {
      setBackfilling(false)
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={backfilling ? <CircularProgress size={14} /> : <FiUserPlus size={14} />}
                onClick={handleBackfillExistingUsers}
                disabled={backfilling}
                size="small"
                sx={{ borderRadius: '8px', borderColor: '#7C3AED', color: '#7C3AED', '&:hover': { borderColor: '#7C3AED', backgroundColor: alpha('#7C3AED', 0.05) } }}
              >
                {backfilling ? 'Enrolling...' : 'Enroll Existing Users'}
              </Button>
              <Button variant="outlined" startIcon={<FiRefreshCw size={14} />} onClick={fetchSubscribers} size="small" sx={{ borderRadius: '8px' }}>
                Refresh Subscribers ({activeCount})
              </Button>
            </Box>
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
                  <Typography variant="body2" sx={{ color: brandColors.muted }}>All registered accounts are automatically enrolled in weekly career insights on signup.</Typography>
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
