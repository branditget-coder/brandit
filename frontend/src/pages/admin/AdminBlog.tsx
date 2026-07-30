import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Button, alpha, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material'
import { motion } from 'framer-motion'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface BlogPostItem {
  id: number
  title: string
  slug: string
  category: string
  published: boolean
  createdAt: string
  readTimeMinutes: number
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPostItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // Dialog State
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Career Growth')
  const [newExcerpt, setNewExcerpt] = useState('')
  const [newContent, setNewContent] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchPosts = async () => {
    try {
      const res = await api.get<BlogPostItem[]>('/admin/blog/all')
      setPosts(res.data)
    } catch (err: any) {
      setError('Failed to load blog posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return
    try {
      await api.delete(`/admin/blog/${id}`)
      fetchPosts()
    } catch (err) {
      alert('Failed to delete post.')
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/blog', {
        title: newTitle,
        category: newCategory,
        excerpt: newExcerpt,
        content: newContent,
        published: true,
        readTimeMinutes: 5,
      })
      setOpenModal(false)
      setNewTitle('')
      setNewExcerpt('')
      setNewContent('')
      fetchPosts()
    } catch (err) {
      alert('Failed to create blog post.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Blog ({posts.length})</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>Create and manage published articles.</Typography>
          </Box>
          <Button variant="contained" startIcon={<FiPlus />} onClick={() => setOpenModal(true)} sx={{ px: 3 }}>
            New Post
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
        ) : posts.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: '20px', border: `1px solid ${brandColors.border}`, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: brandColors.muted }}>No blog posts created yet.</Typography>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflowX: 'auto' }}>
            <Box sx={{ minWidth: 650 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1fr 60px', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
                {['Title', 'Category', 'Status', 'Date', ''].map(h => (
                  <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
                ))}
              </Box>
              {posts.map((p, i) => {
                const formattedDate = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
                return (
                  <Box key={p.id} sx={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1fr 60px', gap: 2, px: 3, py: 2.5, borderBottom: i < posts.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) } }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{p.title}</Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted }}>{p.category || 'General'}</Typography>
                    <Box sx={{ px: 1.5, py: 0.5, borderRadius: '100px', backgroundColor: p.published ? alpha(brandColors.success, 0.1) : alpha(brandColors.muted, 0.1), display: 'inline-flex', alignItems: 'center', width: 'fit-content' }}>
                      <Typography variant="caption" sx={{ color: p.published ? '#059669' : brandColors.muted, fontWeight: 700 }}>{p.published ? 'Published' : 'Draft'}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>{formattedDate}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Box onClick={() => handleDelete(p.id)} sx={{ p: 0.75, borderRadius: '8px', cursor: 'pointer', '&:hover': { backgroundColor: alpha('#EF4444', 0.08) } }}>
                        <FiTrash2 size={16} color="#EF4444" />
                      </Box>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Paper>
        )}
      </motion.div>

      {/* Create Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreate}>
          <DialogTitle>Create New Blog Post</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Post Title" required fullWidth value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <TextField label="Category" required fullWidth value={newCategory} onChange={e => setNewCategory(e.target.value)} />
            <TextField label="Short Excerpt" multiline rows={2} required fullWidth value={newExcerpt} onChange={e => setNewExcerpt(e.target.value)} />
            <TextField label="Full Article Content" multiline rows={5} required fullWidth value={newContent} onChange={e => setNewContent(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={creating}>{creating ? 'Publishing...' : 'Publish Article'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
