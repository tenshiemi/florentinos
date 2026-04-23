import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

const _projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder';
const _hasCredentials = Boolean(import.meta.env.PUBLIC_SANITY_PROJECT_ID);

export const sanityClient = createClient({
  projectId: _projectId,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: false,
  apiVersion: '2026-04-21',
  perspective: 'published',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface GalleryImage {
  _id: string;
  image: SanityImageSource;
  caption?: string;
  displayOrder: number;
}

export interface AboutContent {
  photo: SanityImageSource;
  bio: PortableTextBlock[];
  pageTitle?: string;
  pageDescription?: string;
}

export interface VisitContent {
  address: string;
  googleMapsUrl?: string;
  hours: Array<{ day: string; hours: string }>;
  pageTitle?: string;
  pageDescription?: string;
}

interface SeoFields { title?: string; description?: string; }

export interface SiteSettings {
  businessName: string;
  tagline?: string;
  deliveryLine?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: { instagram?: string; facebook?: string; yelp?: string };
  glsImage?: SanityImageSource;
  seoHome?: SeoFields;
  seoGallery?: SeoFields;
  seoOrder?: SeoFields;
  seoSubscribe?: SeoFields;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!_hasCredentials) return [];
  return (await sanityClient.fetch<GalleryImage[] | null>(
    `*[_type == "galleryImage"] | order(displayOrder asc) { _id, image, caption, displayOrder }`
  ).catch(() => null)) ?? [];
}

export async function getFeaturedImages(): Promise<GalleryImage[]> {
  if (!_hasCredentials) return [];
  return (await sanityClient.fetch<GalleryImage[] | null>(
    `*[_type == "homepageFeatured"][0].images[]-> { _id, image, caption, displayOrder }`
  ).catch(() => null)) ?? [];
}

export async function getAbout(): Promise<AboutContent | null> {
  if (!_hasCredentials) return null;
  return sanityClient.fetch(`*[_type == "about"][0] { photo, bio, pageTitle, pageDescription }`).catch(() => null);
}

export async function getVisitInfo(): Promise<VisitContent | null> {
  if (!_hasCredentials) return null;
  return sanityClient.fetch(`*[_type == "visitInfo"][0] { address, googleMapsUrl, hours, pageTitle, pageDescription }`).catch(() => null);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!_hasCredentials) return null;
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0] { businessName, tagline, deliveryLine, phone, email, address, socialLinks, glsImage, seoHome, seoGallery, seoOrder, seoSubscribe }`
  ).catch(() => null);
}
