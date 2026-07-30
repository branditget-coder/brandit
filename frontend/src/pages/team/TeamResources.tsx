import { useState } from 'react'
import {
  Box, Typography, Grid, Paper, Chip, Button, Divider, Stack, alpha,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiBookOpen, FiFileText, FiCheckSquare, FiAward, FiDownload, FiExternalLink, FiX, FiCheck
} from 'react-icons/fi'
import { brandColors } from '../../theme'

interface SopItem {
  id: string
  title: string
  category: string
  version: string
  description: string
  icon: any
  color: string
  sections: {
    heading: string
    content: string
    bullets?: string[]
  }[]
}

const sops: SopItem[] = [
  {
    id: 'sop-01',
    title: 'LinkedIn Optimization Standard (SOP-01)',
    category: 'LinkedIn Strategy',
    version: 'v2.4',
    description: 'Guidelines for optimizing client headlines, featured sections, banner design alignment, and keyword density for maximum executive reach.',
    icon: FiAward,
    color: brandColors.primary,
    sections: [
      {
        heading: '1. Executive Headline Formula',
        content: 'Every client headline must follow the high-converting BrandIt 3-Part Positioning Architecture:',
        bullets: [
          '[Primary Title/Role] | Helping [Target B2B Audience] Achieve [Specific Measurable Result] | [Authority Proof / Metric]',
          'Avoid generic titles like "Consultant" or "Strategist" without context.',
          'Include 2-3 core niche keywords for LinkedIn search indexing.',
        ],
      },
      {
        heading: '2. Banner & Visual Branding Guidelines',
        content: 'Banners must maintain strict visual consistency:',
        bullets: [
          'Dimensions: 1584 x 396 px high resolution PNG.',
          'Left side clear: Keep bottom-left 25% area uncluttered so the profile DP does not obscure key text on mobile screens.',
          'Include Brand Tagline, Call-To-Action (e.g. "DM FOR CONSULTATION"), and brand accent colors.',
        ],
      },
      {
        heading: '3. About Section 3-Act Structure',
        content: 'Structure client About sections as an engaging founder narrative:',
        bullets: [
          'Act 1 (The Hook): First 2 lines must state the core vision and problem solved.',
          'Act 2 (Proof & Methodology): Key achievements, client milestones, and core framework.',
          'Act 3 (Call to Action): Clear contact instructions, website link, and consultation booking link.',
        ],
      },
    ],
  },
  {
    id: 'sop-02',
    title: 'Client Onboarding & Intake Protocol (SOP-02)',
    category: 'Operations',
    version: 'v1.8',
    description: 'Step-by-step procedures for conducting initial 30-minute discovery calls, extracting founder story hooks, and setting milestone deliverables.',
    icon: FiCheckSquare,
    color: '#10B981',
    sections: [
      {
        heading: '1. Pre-Call Research Checklist',
        content: 'Before launching any discovery consultation call with a client:',
        bullets: [
          'Review client profile, company website, and current social media presence.',
          'Identify top 3 content gaps and visual inconsistencies.',
          'Prepare tailored profile audit checklist in advance.',
        ],
      },
      {
        heading: '2. 30-Minute Discovery Call Structure',
        content: 'Follow the strict 4-phase consultation agenda:',
        bullets: [
          'Minutes 0-5: Warm rapport & goal alignment.',
          'Minutes 5-15: Deep-dive into client vision, personal story, and target audience.',
          'Minutes 15-25: Present customized personal branding roadmap & strategy.',
          'Minutes 25-30: Confirm deliverables timeline and schedule kickoff session.',
        ],
      },
      {
        heading: '3. Post-Call Deliverables',
        content: 'Send post-consultation summary email within 2 hours including call recording link, positioning doc draft, and next steps timeline.',
      },
    ],
  },
  {
    id: 'sop-03',
    title: 'Executive Content Calendar Framework (SOP-03)',
    category: 'Content Creation',
    version: 'v3.0',
    description: 'Weekly posting schedules, hook writing frameworks, carousels vs text posts ratio, and engagement pod strategies.',
    icon: FiFileText,
    color: '#8B5CF6',
    sections: [
      {
        heading: '1. Content Mix Matrix (40-30-20-10 Rule)',
        content: 'Distribute client post types across 4 core pillars:',
        bullets: [
          '40% Industry Insights & Authority Posts (Deep value, frameworks, analysis).',
          '30% Founder Stories & Behind-The-Scenes (Personal lessons, challenges overcome).',
          '20% Case Studies & Social Proof (Client testimonials, milestone numbers).',
          '10% Direct Soft Pitches (Promoting consultation calls or newsletter signups).',
        ],
      },
      {
        heading: '2. Post Formatting & Algorithm Optimization',
        content: 'Maximize organic reach on LinkedIn:',
        bullets: [
          'First 2 lines: Must create high curiosity ("See More" click rate > 40%).',
          'Use clean spacing with short 1-2 sentence paragraphs.',
          'Carousel posts (PDF format): Keep to 6-10 slides with bold typography.',
        ],
      },
    ],
  },
  {
    id: 'sop-04',
    title: 'Client Financial & Billing Procedures (SOP-04)',
    category: 'Accounting & Finance',
    version: 'v1.2',
    description: 'Invoicing standards, payment link generation, GST accounting compliance, and refund protocol.',
    icon: FiBookOpen,
    color: '#F59E0B',
    sections: [
      {
        heading: '1. Invoicing & Payment Terms',
        content: 'All invoices must be issued via BrandIt official billing portal prior to project kickoff:',
        bullets: [
          '100% upfront payment for individual consultation sessions.',
          '50/50 milestone split for full corporate branding retainers.',
          'Include GST registration number and clear line items.',
        ],
      },
      {
        heading: '2. Refund & Satisfaction Policy',
        content: 'Handle refund requests in accordance with BrandIt Refund Guidelines (100% refund eligible if cancelled 24+ hours prior to session).',
      },
    ],
  },
]

const templates = [
  {
    id: 'tpl-01',
    name: 'LinkedIn Profile Audit Scorecard Template',
    filename: 'BrandIt_LinkedIn_Profile_Audit_Scorecard.csv',
    type: 'CSV Spreadsheet Template',
    content: `Section,Element,Target Standard,Score (1-10),Recommendations
Header,Profile Picture,High resolution headshot with clean background,,
Header,Headline,Role + Value Proposition + Proof,,
Header,Banner Image,1584x396px branded visual with CTA,,
About,Hook,First 2 lines drive "See More" clicks,,
About,Story & Achievements,Quantifiable metrics and founder background,,
Featured,Pinned Items,Top performing post + Consultation booking link,,
Activity,Posting Consistency,Minimum 3x weekly valuable content,,`,
  },
  {
    id: 'tpl-02',
    name: 'Founder Positioning Discovery Questionnaire',
    filename: 'Founder_Positioning_Discovery_Questionnaire.md',
    type: 'Markdown Questionnaire',
    content: `# BrandIt Founder Positioning Discovery Questionnaire

## 1. Executive Summary
- **Client Full Name**:
- **Current Title & Organization**:
- **Target Audience**: (e.g. VCs, Enterprise Buyers, Tech Talent)

## 2. Core Brand Identity
1. What is your primary goal for personal branding over the next 6 months?
2. What are 3 core topics or industries you want to be recognized as an expert in?
3. What is a opinion or unique perspective you hold in your industry?

## 3. Story & Milestones
- List 3 key career milestones or turning points.
- What client result or achievement are you most proud of?

## 4. Next Steps
Return this completed form to your BrandIt Lead Consultant at least 24 hours prior to your strategy session.`,
  },
  {
    id: 'tpl-03',
    name: 'Weekly Client Growth Report Template',
    filename: 'Weekly_Client_Growth_Report_Template.txt',
    type: 'Text Report Template',
    content: `========================================================
BRANDIT EXECUTIVE CONSULTING - WEEKLY PERFORMANCE REPORT
========================================================

Client Name: [Insert Client Name]
Reporting Period: [Start Date] - [End Date]
Prepared By: BrandIt Growth Team

1. KEY METRICS SNAPSHOT
--------------------------------------------------------
- Total Profile Views: +[X]% vs last week
- Post Impressions: [X] total views
- Engagement Rate: [X]%
- Inbound Inquiries / DMs: [X] qualified leads

2. TOP PERFORMING POST OF THE WEEK
--------------------------------------------------------
- Topic / Hook: "[Insert Post Title]"
- Engagement: [X] Likes, [X] Comments, [X] Shares

3. STRATEGIC RECOMMENDATIONS FOR NEXT WEEK
--------------------------------------------------------
1. Focus on carousel breakdown of [Topic].
2. Engage with top 20 key industry leaders in comments.
3. Optimize profile Featured section link.

========================================================`,
  },
  {
    id: 'tpl-04',
    name: 'Executive Content Strategy Swipe File 2026',
    filename: 'Executive_Content_Swipe_File_2026.json',
    type: 'JSON Swipe File',
    content: JSON.stringify(
      {
        collection: 'BrandIt Executive Content Framework 2026',
        hooks: [
          'I spent 10 years building teams. Here are the 5 lessons I wish I knew on day 1:',
          'Most founders get personal branding wrong. They focus on reach instead of authority.',
          'Here is the exact 4-step framework we used to scale founder reach by 300%:',
        ],
        callToActions: [
          'If you found this valuable, repost to help your network.',
          'Want our customized profile audit checklist? Comment "BRAND" below.',
        ],
      },
      null,
      2
    ),
  },
]

export default function TeamResources() {
  const [selectedSop, setSelectedSop] = useState<SopItem | null>(null)

  // Browser File Download Handler
  const handleDownloadAsset = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
                    onClick={() => setSelectedSop(sop)}
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

        {/* Downloadable Templates & Client Assets */}
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
                  onClick={() => handleDownloadAsset(tpl.filename, tpl.content)}
                  startIcon={<FiDownload size={14} />}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: brandColors.border,
                    '&:hover': { borderColor: brandColors.primary, color: brandColors.primary },
                  }}
                >
                  Download Asset
                </Button>
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Fully Interactive SOP Playbook Modal Reader */}
        <Dialog
          open={Boolean(selectedSop)}
          onClose={() => setSelectedSop(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '24px', p: { xs: 1, sm: 2 } },
          }}
        >
          {selectedSop && (
            <>
              <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: alpha(selectedSop.color, 0.1), color: selectedSop.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <selectedSop.icon size={20} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text }}>
                      {selectedSop.title}
                    </Typography>
                    <Chip label={selectedSop.version} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedSop(null)} size="small">
                  <FiX size={20} />
                </IconButton>
              </DialogTitle>

              <DialogContent dividers sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: brandColors.muted, mb: 3, fontStyle: 'italic', background: alpha(brandColors.primary, 0.04), p: 2, borderRadius: '12px' }}>
                  {selectedSop.description}
                </Typography>

                <Stack spacing={3}>
                  {selectedSop.sections.map((sec, idx) => (
                    <Box key={idx}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text, mb: 1, fontSize: '1.05rem' }}>
                        {sec.heading}
                      </Typography>
                      <Typography variant="body2" sx={{ color: brandColors.text, mb: 1.5, lineHeight: 1.6 }}>
                        {sec.content}
                      </Typography>

                      {sec.bullets && (
                        <List dense disablePadding>
                          {sec.bullets.map((b, bIdx) => (
                            <ListItem key={bIdx} sx={{ px: 0, py: 0.4 }}>
                              <ListItemIcon sx={{ minWidth: 28, color: selectedSop.color }}>
                                <FiCheck size={16} />
                              </ListItemIcon>
                              <ListItemText
                                primary={b}
                                primaryTypographyProps={{ variant: 'body2', color: brandColors.text, fontWeight: 500 }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  ))}
                </Stack>
              </DialogContent>

              <DialogActions sx={{ pt: 2, px: 3, justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>
                  BrandIt Internal SOP • Confidential
                </Typography>
                <Button variant="contained" onClick={() => setSelectedSop(null)} sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none', px: 3 }}>
                  Close Playbook
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </Box>
  )
}
