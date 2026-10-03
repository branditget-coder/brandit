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
  FiEye, FiZap, FiRefreshCw, FiX, FiUserPlus, FiCalendar, FiStar
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

import { SubscriberItem, BroadcastResult, WeeklyEdition } from '../../types'

// Fresh, easy-to-read, image-rich weekly emails
const FRESH_PRESETS: WeeklyEdition[] = [
  {
    id: 'linkedin_hook_trick',
    title: 'The 3-Second LinkedIn Hook (10x Profile Views)',
    subject: '🔥 Steal This 3-Second Trick to 10x Your Profile Views',
    badge: 'LinkedIn Growth',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Creative modern digital gradient background',
    summary: 'Turn your LinkedIn headline into an inbound opportunity magnet in 2 minutes.',
    contentHtml: `<div style="margin-bottom:18px; text-align:center;">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" alt="LinkedIn Growth" style="width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);" />
</div>
<div style="margin-bottom:12px;">
  <span style="display:inline-block; background-color:#EEF2FF; color:#4F46E5; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;">✨ MONDAY QUICK WIN</span>
</div>
<h3 style="color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;">The 3-Second LinkedIn Hook That Attracts Recruiters</h3>
<p style="font-size:15px; color:#334155; line-height:1.6; margin-top:0;">Happy Monday! 👋 Ever feel like your profile gets lost in the crowd? Most LinkedIn headlines are totally invisible because they only list a dry job title. Here are 3 quick tweaks you can make in 2 minutes:</p>
<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;">
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">🎯 <strong>Use the 3-Part Hook:</strong> [Role] + [Who You Help] + [Tangible Win].<br><span style="color:#64748B;">Example: <em>Lead Designer | Helping SaaS teams turn clicks into happy paying users</em></span></p>
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">📸 <strong>Friendly Smiling Photo:</strong> Profiles with a warm smile and clean background get <strong>14x more views</strong>.</p>
  <p style="margin:0; color:#1E293B; font-size:14px; line-height:1.6;">⚡ <strong>Pin Your Proof:</strong> Put your proudest case study or recommendation right in your Featured section.</p>
</div>
<div style="background-color:#F0FDF4; border:1px solid #BBF7D0; border-left:4px solid #16A34A; border-radius:10px; padding:12px 16px; margin:16px 0;">
  <p style="margin:0; font-weight:700; color:#15803D; font-size:14px;">⚡ 2-Minute Monday Challenge:</p>
  <p style="margin:4px 0 0 0; color:#166534; font-size:13px;">Open your LinkedIn profile right now and update your headline before your coffee gets cold!</p>
</div>
<p style="font-size:14px; color:#64748B; margin:16px 0 0 0;">Go crush this week! 🚀<br><strong>— The BrandIt Team</strong></p>`
  },
  {
    id: 'resume_scanner_secret',
    title: 'Why 90% of Resumes Get Skipped (And How to Win)',
    subject: '📄 Why 90% of Resumes Get Skipped in 6 Seconds',
    badge: 'Resume Secret',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Clean modern workspace with notebook and pen',
    summary: 'Recruiters only scan for 6 seconds. Here is how to make every second count.',
    contentHtml: `<div style="margin-bottom:18px; text-align:center;">
  <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80" alt="Resume Hack" style="width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);" />
</div>
<div style="margin-bottom:12px;">
  <span style="display:inline-block; background-color:#FEF3C7; color:#B45309; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;">📄 RESUME MAKEOVER</span>
</div>
<h3 style="color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;">Pass the 6-Second Recruiter Glance</h3>
<p style="font-size:15px; color:#334155; line-height:1.6; margin-top:0;">Happy Monday! 👋 Recruiters review hundreds of resumes every single week. If your CV is a dense block of text, it gets skipped. Here's how to stand out instantly:</p>
<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;">
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">💥 <strong>Ditch Fuzzy Buzzwords:</strong> Replace 'hard worker' and 'responsible for' with action verbs like <em>spearheaded</em>, <em>accelerated</em>, and <em>built</em>.</p>
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">📊 <strong>The Number Rule:</strong> Add a metric to your bullet points. <em>'Trained staff'</em> ➔ <em>'Trained 8 team members and boosted team productivity by 25%'</em>.</p>
  <p style="margin:0; color:#1E293B; font-size:14px; line-height:1.6;">✂️ <strong>Keep It Tight (1–2 Pages):</strong> Clean, scannable layouts get 3x more interview callbacks than cluttered 4-page documents.</p>
</div>
<div style="background-color:#EFF6FF; border:1px solid #BFDBFE; border-left:4px solid #2563EB; border-radius:10px; padding:12px 16px; margin:16px 0;">
  <p style="margin:0; font-weight:700; color:#1D4ED8; font-size:14px;">⚡ 2-Minute Monday Challenge:</p>
  <p style="margin:4px 0 0 0; color:#1E40AF; font-size:13px;">Pick one bullet point on your resume today and add a percentage or number to it!</p>
</div>
<p style="font-size:14px; color:#64748B; margin:16px 0 0 0;">You've got this! 🚀<br><strong>— The BrandIt Team</strong></p>`
  },
  {
    id: 'networking_cheat_code',
    title: 'The 1-Message Networking Hack (92% Reply Rate)',
    subject: '🚀 The 1-Message Networking Hack (92% Reply Rate)',
    badge: 'Smart Networking',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Collaborative creative team sharing ideas',
    summary: 'Why cold messages fail and how to write DMs people love replying to.',
    contentHtml: `<div style="margin-bottom:18px; text-align:center;">
  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" alt="Smart Networking" style="width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);" />
</div>
<div style="margin-bottom:12px;">
  <span style="display:inline-block; background-color:#ECFDF5; color:#047857; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;">🚀 NETWORKING MAGIC</span>
</div>
<h3 style="color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;">How to Message Anyone and Actually Get a Reply</h3>
<p style="font-size:15px; color:#334155; line-height:1.6; margin-top:0;">Happy Monday! 👋 Cold outreach fails when you ask for favors immediately (*'Can you refer me to your boss?'*). It succeeds when you lead with genuine appreciation:</p>
<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;">
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">🎁 <strong>Give Before You Ask:</strong> Start by complimenting a specific post, article, or project they shipped recently.</p>
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">⏱️ <strong>The 4-Sentence Rule:</strong> Keep it bite-sized. Busy professionals answer short, thoughtful notes 10x faster than long paragraphs.</p>
  <p style="margin:0; color:#1E293B; font-size:14px; line-height:1.6;">🕊️ <strong>The Zero-Pressure Ending:</strong> Close with: <em>'No need to reply, just wanted to say thank you for sharing that insight!'</em> (Ironically, this generates the highest reply rate).</p>
</div>
<div style="background-color:#FDF2F8; border:1px solid #FBCFE8; border-left:4px solid #DB2777; border-radius:10px; padding:12px 16px; margin:16px 0;">
  <p style="margin:0; font-weight:700; color:#BE185D; font-size:14px;">⚡ 2-Minute Monday Challenge:</p>
  <p style="margin:4px 0 0 0; color:#9D174D; font-size:13px;">Send 1 sincere, no-strings-attached compliment to someone you admire in your industry today!</p>
</div>
<p style="font-size:14px; color:#64748B; margin:16px 0 0 0;">Build meaningful connections! ✨<br><strong>— The BrandIt Team</strong></p>`
  },
  {
    id: 'interview_bridge_technique',
    title: 'Never Say "I Don\'t Know" in an Interview (Say This Instead)',
    subject: "💡 Never Say 'I Don't Know' in an Interview (Say This Instead)",
    badge: 'Interview Mastery',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Confident smiling professional in a modern office',
    summary: 'How to handle unexpected interview questions with poise and confidence.',
    contentHtml: `<div style="margin-bottom:18px; text-align:center;">
  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" alt="Interview Confidence" style="width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);" />
</div>
<div style="margin-bottom:12px;">
  <span style="display:inline-block; background-color:#FEF3C7; color:#D97706; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;">💡 INTERVIEW SECRET</span>
</div>
<h3 style="color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;">Turn Tough Questions into Big Wins</h3>
<p style="font-size:15px; color:#334155; line-height:1.6; margin-top:0;">Happy Monday! 👋 Getting hit with a curveball question can make your heart race. But great interviewers don't expect you to have every answer memorized—they want to see how you solve problems under pressure.</p>
<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;">
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">🌉 <strong>The Bridge Phrase:</strong> Instead of saying 'I don't know', say: <em>'I haven't tackled that exact scenario yet, but here is how I would break down the problem...'</em></p>
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">🗣️ <strong>Think Out Loud:</strong> Walk them through your thought process. Companies hire collaborative problem-solvers, not walking encyclopedias.</p>
  <p style="margin:0; color:#1E293B; font-size:14px; line-height:1.6;">⏱️ <strong>Embrace the 3-Second Pause:</strong> Don't rush to speak immediately. A short pause makes you appear calm, thoughtful, and executive.</p>
</div>
<div style="background-color:#F0FDF4; border:1px solid #BBF7D0; border-left:4px solid #16A34A; border-radius:10px; padding:12px 16px; margin:16px 0;">
  <p style="margin:0; font-weight:700; color:#15803D; font-size:14px;">⚡ 2-Minute Monday Challenge:</p>
  <p style="margin:4px 0 0 0; color:#166534; font-size:13px;">Practice pausing 3 seconds before answering your next phone or video call today!</p>
</div>
<p style="font-size:14px; color:#64748B; margin:16px 0 0 0;">Confidence looks great on you! 🚀<br><strong>— The BrandIt Team</strong></p>`
  },
  {
    id: 'fifteen_minute_brand_routine',
    title: 'The 15-Minute Brand Routine That Brings Inbound Offers',
    subject: '✨ The 15-Minute Weekly Routine for Inbound Job Offers',
    badge: 'Personal Branding',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Minimalist desk with laptop and fresh green plant',
    summary: 'Build career gravity without spending hours on social media every day.',
    contentHtml: `<div style="margin-bottom:18px; text-align:center;">
  <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80" alt="Personal Brand Routine" style="width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);" />
</div>
<div style="margin-bottom:12px;">
  <span style="display:inline-block; background-color:#F5F3FF; color:#7C3AED; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;">✨ BRAND ON AUTOPILOT</span>
</div>
<h3 style="color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;">15 Minutes a Week is All It Takes</h3>
<p style="font-size:15px; color:#334155; line-height:1.6; margin-top:0;">Happy Monday! 👋 Think personal branding means posting three times a day? Absolutely not. You can build incredible career leverage in just 15 minutes across the week:</p>
<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;">
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">📅 <strong>Monday (5 Mins):</strong> Share 1 real lesson from your workday last week. Real stories beat generic advice 100% of the time.</p>
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">💬 <strong>Wednesday (5 Mins):</strong> Leave 2 thoughtful, value-add comments on top industry posts. Their audience becomes your audience.</p>
  <p style="margin:0; color:#1E293B; font-size:14px; line-height:1.6;">🤝 <strong>Friday (5 Mins):</strong> Send 3 warm connection requests to peers working at companies you respect.</p>
</div>
<div style="background-color:#FDF4FF; border:1px solid #F0ABFC; border-left:4px solid #C026D3; border-radius:10px; padding:12px 16px; margin:16px 0;">
  <p style="margin:0; font-weight:700; color:#A21CAF; font-size:14px;">⚡ 2-Minute Monday Challenge:</p>
  <p style="margin:4px 0 0 0; color:#86198F; font-size:13px;">Find one inspiring post in your feed right now and write a 2-sentence thoughtful comment!</p>
</div>
<p style="font-size:14px; color:#64748B; margin:16px 0 0 0;">Make yourself visible! 🌟<br><strong>— The BrandIt Team</strong></p>`
  },
  {
    id: 'magic_salary_phrase',
    title: 'The Magic Sentence That Adds 15% to Any Job Offer',
    subject: '💰 The Magic Sentence That Adds 15% to Any Job Offer',
    badge: 'Salary Boost',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Modern glass corporate architecture reaching into the sky',
    summary: 'How to negotiate your compensation with total ease and professionalism.',
    contentHtml: `<div style="margin-bottom:18px; text-align:center;">
  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" alt="Salary Negotiation" style="width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);" />
</div>
<div style="margin-bottom:12px;">
  <span style="display:inline-block; background-color:#FEF3C7; color:#B45309; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;">💰 CAREER LEVERAGE</span>
</div>
<h3 style="color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;">Never Leave Money on the Table</h3>
<p style="font-size:15px; color:#334155; line-height:1.6; margin-top:0;">Happy Monday! 👋 Over 60% of professionals accept their first job offer without negotiating simply because asking feels awkward. Here is how to negotiate without friction:</p>
<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;">
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">🛑 <strong>Never Say 'Yes' Immediately:</strong> Always say: <em>'Thank you so much! I am thrilled. May I have 24 hours to review the full offer package?'</em></p>
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">🎯 <strong>The Magic Phrase:</strong> <em>'Based on my track record delivering [Key Win] and current market benchmarks, is there room to adjust base compensation to [Target]?'</em></p>
  <p style="margin:0; color:#1E293B; font-size:14px; line-height:1.6;">🤫 <strong>The Power of Silence:</strong> Once you ask your question, stop talking. Wait for them to respond first.</p>
</div>
<div style="background-color:#EFF6FF; border:1px solid #BFDBFE; border-left:4px solid #2563EB; border-radius:10px; padding:12px 16px; margin:16px 0;">
  <p style="margin:0; font-weight:700; color:#1D4ED8; font-size:14px;">⚡ 2-Minute Monday Challenge:</p>
  <p style="margin:4px 0 0 0; color:#1E40AF; font-size:13px;">Check the average market salary benchmark for your role on Levels.fyi or Glassdoor today!</p>
</div>
<p style="font-size:14px; color:#64748B; margin:16px 0 0 0;">Know your true worth! 💼<br><strong>— The BrandIt Team</strong></p>`
  },
  {
    id: 'beat_imposter_syndrome',
    title: 'Beat Imposter Syndrome in 60 Seconds (The Brag Sheet)',
    subject: '⚡ Beat Imposter Syndrome in 60 Seconds (The Brag Sheet)',
    badge: 'Confidence Booster',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Ambitious professional walking forward with purpose',
    summary: 'Why high achievers doubt themselves and the 1 folder that cures it.',
    contentHtml: `<div style="margin-bottom:18px; text-align:center;">
  <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" alt="Beat Imposter Syndrome" style="width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);" />
</div>
<div style="margin-bottom:12px;">
  <span style="display:inline-block; background-color:#EFF6FF; color:#2563EB; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;">⚡ MINDSET RESET</span>
</div>
<h3 style="color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;">You Are More Qualified Than You Think</h3>
<p style="font-size:15px; color:#334155; line-height:1.6; margin-top:0;">Happy Monday! 👋 Ever feel like you just got lucky and someday someone will 'figure it out'? That's imposter syndrome talking, and it affects over 75% of high performers. Here's your antidote:</p>
<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;">
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">📁 <strong>The 'Brag Sheet' Folder:</strong> Create a folder on your phone or drive. Save screenshots of nice client messages, compliments, and project wins.</p>
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">🌱 <strong>Reframe the Doubt:</strong> Feeling slightly out of your comfort zone doesn't mean you're fake—it means you are expanding into a bigger role.</p>
  <p style="margin:0; color:#1E293B; font-size:14px; line-height:1.6;">🤝 <strong>Shift Focus Outward:</strong> Whenever self-doubt creeps in, ask: <em>'How can I help a teammate win today?'</em> Action cures anxiety every time.</p>
</div>
<div style="background-color:#F0FDF4; border:1px solid #BBF7D0; border-left:4px solid #16A34A; border-radius:10px; padding:12px 16px; margin:16px 0;">
  <p style="margin:0; font-weight:700; color:#15803D; font-size:14px;">⚡ 2-Minute Monday Challenge:</p>
  <p style="margin:4px 0 0 0; color:#166534; font-size:13px;">Write down 2 accomplishments you pulled off last month and acknowledge your hard work!</p>
</div>
<p style="font-size:14px; color:#64748B; margin:16px 0 0 0;">Keep moving forward with pride! 💪<br><strong>— The BrandIt Team</strong></p>`
  },
  {
    id: 'virtual_presence_habits',
    title: '3 Video Call Habits That Make You Unforgettable',
    subject: '🎯 3 Video Call Habits That Make You Unforgettable on Zoom',
    badge: 'Executive Presence',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Bright modern video conferencing room with natural lighting',
    summary: 'Small non-verbal adjustments that command respect in remote meetings.',
    contentHtml: `<div style="margin-bottom:18px; text-align:center;">
  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80" alt="Executive Presence" style="width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);" />
</div>
<div style="margin-bottom:12px;">
  <span style="display:inline-block; background-color:#ECFDF5; color:#047857; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;">🎯 EXECUTIVE PRESENCE</span>
</div>
<h3 style="color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;">Level Up Your Virtual Presence in 60 Seconds</h3>
<p style="font-size:15px; color:#334155; line-height:1.6; margin-top:0;">Happy Monday! 👋 Over 70% of human trust is established through non-verbal cues. On Zoom and Meet calls, these 3 quick adjustments instantly make you look senior and credible:</p>
<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;">
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">👁️ <strong>Camera at Eye Level:</strong> Prop your laptop on books or a stand. Looking straight into the camera conveys authority, while looking down makes you appear disengaged.</p>
  <p style="margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;">💡 <strong>Front Lighting Only:</strong> Always ensure your primary light source is in front of your face, never behind your back where you turn into a shadow.</p>
  <p style="margin:0; color:#1E293B; font-size:14px; line-height:1.6;">🎯 <strong>Look at the Lens When Delivering Points:</strong> When stating your main proposal, look straight into the camera lens dot. To the viewer, it feels like direct eye contact.</p>
</div>
<div style="background-color:#FEF3C7; border:1px solid #FCD34D; border-left:4px solid #D97706; border-radius:10px; padding:12px 16px; margin:16px 0;">
  <p style="margin:0; font-weight:700; color:#B45309; font-size:14px;">⚡ 2-Minute Monday Challenge:</p>
  <p style="margin:4px 0 0 0; color:#92400E; font-size:13px;">Raise your laptop screen by 2–3 inches right now before your next video meeting!</p>
</div>
<p style="font-size:14px; color:#64748B; margin:16px 0 0 0;">Command the virtual room! 🎙️<br><strong>— The BrandIt Team</strong></p>`
  }
]

export default function AdminWeeklyInsights() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  // Presets & upcoming Monday edition from server
  const [presets, setPresets] = useState<WeeklyEdition[]>(FRESH_PRESETS)
  const [upcomingEdition, setUpcomingEdition] = useState<WeeklyEdition | null>(FRESH_PRESETS[0])

  // Broadcast Form State
  const [selectedPreset, setSelectedPreset] = useState<string>(FRESH_PRESETS[0].id)
  const [subject, setSubject] = useState<string>(FRESH_PRESETS[0].subject)
  const [contentHtml, setContentHtml] = useState<string>(FRESH_PRESETS[0].contentHtml)
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

  const fetchPresetsAndUpcoming = async () => {
    try {
      const [presetsRes, upcomingRes] = await Promise.allSettled([
        api.get<WeeklyEdition[]>('/admin/newsletter/presets'),
        api.get<WeeklyEdition>('/admin/newsletter/upcoming')
      ])

      if (presetsRes.status === 'fulfilled' && presetsRes.value.data?.length) {
        setPresets(presetsRes.value.data)
      }
      if (upcomingRes.status === 'fulfilled' && upcomingRes.value.data) {
        setUpcomingEdition(upcomingRes.value.data)
      }
    } catch {
      // Default to fresh presets
    }
  }

  useEffect(() => {
    fetchSubscribers()
    fetchPresetsAndUpcoming()
  }, [])

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId)
    if (presetId === 'custom') return

    const found = presets.find(p => p.id === presetId)
    if (found) {
      setSubject(found.subject)
      setContentHtml(found.contentHtml)
    }
  }

  const handleLoadUpcomingEdition = () => {
    if (upcomingEdition) {
      setSelectedPreset(upcomingEdition.id)
      setSubject(upcomingEdition.subject)
      setContentHtml(upcomingEdition.contentHtml)
      setSnackbar({
        open: true,
        message: `Loaded this Monday's edition: "${upcomingEdition.title}"`,
        severity: 'success'
      })
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
  const activePresetItem = presets.find(p => p.id === selectedPreset)

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h3">Career Weekly Insights Broadcast</Typography>
            <Chip
              icon={<FiStar size={14} />}
              label="Fresh & Image-Rich"
              size="small"
              sx={{ bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 800 }}
            />
          </Box>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>
            Delivering fresh, easy-to-read, catchy career and personal branding emails with high-res visuals every Monday.
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
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.04em' }}>AUTO MONDAY ROTATION</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#7C3AED' }}>Every Mon @ 9:00 AM IST</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* AUTOMATED MONDAY EDITION CARD */}
        {upcomingEdition && (
          <Paper
            sx={{
              p: 3,
              borderRadius: '20px',
              border: `1px solid ${alpha(brandColors.primary, 0.25)}`,
              background: `linear-gradient(135deg, ${alpha(brandColors.primary, 0.04)} 0%, #FFFFFF 100%)`,
              mb: 4,
              boxShadow: 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, minWidth: 280 }}>
                {upcomingEdition.imageUrl && (
                  <Box
                    component="img"
                    src={upcomingEdition.imageUrl}
                    alt={upcomingEdition.title}
                    sx={{
                      width: 90,
                      height: 70,
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  />
                )}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip
                      icon={<FiCalendar size={12} />}
                      label="AUTOMATED MONDAY EDITION"
                      size="small"
                      sx={{ bgcolor: '#0A66C2', color: '#fff', fontWeight: 800, fontSize: '0.68rem' }}
                    />
                    <Chip
                      label={upcomingEdition.badge}
                      size="small"
                      sx={{ bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700, fontSize: '0.68rem' }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text }}>
                    {upcomingEdition.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted }}>
                    Subject: <em>{upcomingEdition.subject}</em>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLoadUpcomingEdition}
                  sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                >
                  Load into Composer
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<FiSend size={14} />}
                  onClick={() => {
                    handleLoadUpcomingEdition()
                    setPreviewOpen(true)
                  }}
                  sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                >
                  Preview & Send
                </Button>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Composer Panel */}
        <Paper sx={{ p: 4, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FiZap size={22} color={brandColors.primary} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Compose & Broadcast Fresh Insights</Typography>
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="preset-label">Choose Fresh Weekly Email Preset</InputLabel>
                  <Select
                    labelId="preset-label"
                    label="Choose Fresh Weekly Email Preset"
                    value={selectedPreset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                  >
                    {presets.map((preset, idx) => (
                      <MenuItem key={preset.id} value={preset.id}>
                        {idx + 1}. {preset.title} ({preset.badge})
                      </MenuItem>
                    ))}
                    <MenuItem value="custom">✏️ Custom Fresh Draft</MenuItem>
                  </Select>
                </FormControl>
                {activePresetItem?.imageUrl && (
                  <Tooltip title="Hero Image Included">
                    <Box
                      component="img"
                      src={activePresetItem.imageUrl}
                      alt="Thumbnail"
                      sx={{ width: 44, height: 40, borderRadius: 1.5, objectFit: 'cover', border: `1px solid ${brandColors.border}` }}
                    />
                  </Tooltip>
                )}
              </Box>

              {/* Subject Input */}
              <TextField
                label="Email Subject Line (Catchy & Engaging)"
                fullWidth
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. 🔥 Steal This 3-Second Trick to 10x Your Profile Views"
              />

              {/* Content Editor */}
              <TextField
                label="Email Body Content (Includes Catchy Headings, Hero Images & Quick Challenges)"
                fullWidth
                required
                multiline
                rows={11}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                helperText="Formatted with easy-to-read bullet points, featured hero images, action challenges, and clear typography."
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
                  {sending ? 'Broadcasting...' : `Send Fresh Email to ${activeCount} Account(s)`}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FiEye color={brandColors.primary} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Fresh Email Template Preview</Typography>
          </Box>
          <IconButton onClick={() => setPreviewOpen(false)} size="small"><FiX /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4, backgroundColor: '#F3F4F6' }}>
          <Box sx={{ maxWidth: 600, mx: 'auto', backgroundColor: '#FFFFFF', borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            {/* Header */}
            <Box sx={{ background: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)', p: 3, textAlign: 'center', color: '#fff' }}>
              <Box sx={{ display: 'inline-block', backgroundColor: '#FFFFFF', color: '#0A66C2', fontWeight: 900, fontSize: 22, px: 2, py: 0.5, borderRadius: 2, mb: 1 }}>
                B<span style={{ color: '#60A5FA' }}>i</span>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', m: 0 }}>BrandIt Consulting</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>Your Profile, Your Brand, Your Opportunity</Typography>
            </Box>

            {/* Email Inner Body */}
            <Box sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0A66C2', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                  ✨ BrandIt Monday Spark • Weekly Digest
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  A fresh, easy 60-second read curated for your subscribers
                </Typography>
              </Box>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </Paper>

              {/* Consultation Callout */}
              <Box sx={{ mt: 3, p: 2.5, textAlign: 'center', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: 3, border: '1px solid #BAE6FD' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0369A1', mb: 0.5 }}>
                  Want to accelerate your career even faster?
                </Typography>
                <Typography variant="caption" sx={{ color: '#0284C7', display: 'block', mb: 1.5 }}>
                  Get a 1-on-1 personalized review of your resume and LinkedIn profile.
                </Typography>
                <Button variant="contained" color="primary" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>
                  Book 1-on-1 Consultation &rarr;
                </Button>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ backgroundColor: '#111827', p: 3, textAlign: 'center', color: '#9CA3AF' }}>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, mb: 0.5, color: '#D1D5DB' }}>
                BrandIt Consulting & Personal Branding
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                Hritika Seth (Consultant) • Kritika Dhawan (Operations)
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                © {new Date().getFullYear()} BrandIt. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              setPreviewOpen(false)
              handleBroadcastSubmit(e as any)
            }}
            disabled={sending || activeCount === 0}
            startIcon={<FiSend size={14} />}
          >
            Send Now to {activeCount} Account(s)
          </Button>
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
