export interface ContactInquiry {
  name: string
  email: string
  phone?: string
  serviceInterested?: string
  message: string
}

export interface Testimonial {
  id: number
  clientName: string
  clientRole: string
  clientCompany?: string
  clientAvatarUrl?: string
  content: string
  result?: string
  rating: number
  approved: boolean
  createdAt?: string
}
