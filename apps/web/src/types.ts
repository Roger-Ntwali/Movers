export interface Service {
  id: string;
  title: string;
  slug: string;
  tag: string | null;
  lead: string | null;
  description: string | null;
  includes: string[];
  imageUrls: string[];
  displayOrder: number;
  isActive: boolean;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  altText: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRoleOrLocation: string | null;
  quote: string;
  rating: number | null;
  isFeatured: boolean;
  displayOrder: number;
}

export interface ServiceArea {
  id: string;
  districtName: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  displayOrder: number;
}

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  coverImageUrl: string | null;
  category: string | null;
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export interface Lead {
  id: string;
  pickup: string;
  dropoff: string;
  moveType: string;
  moveDate: string;
  rooms: string;
  name: string;
  phone: string;
  email: string | null;
  details: string | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SiteSettings = Record<string, string>;
