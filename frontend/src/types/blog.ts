export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  summary: string
  author: string
  imageUrl?: string
  tags?: string[]
  published: boolean
  publishedAt?: string
  createdAt?: string
}

export interface BlogPostPayload {
  title: string
  summary: string
  content: string
  author: string
  imageUrl?: string
  tags?: string[]
  published: boolean
}
