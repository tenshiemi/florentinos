import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: true,
  apiVersion: '2026-04-21',
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
  bio: unknown[];
}

export interface VisitContent {
  address: string;
  googleMapsUrl?: string;
  hours: Array<{ day: string; hours: string }>;
}

export interface SiteSettings {
  businessName: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: { instagram?: string; facebook?: string };
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return sanityClient.fetch(
    `*[_type == "galleryImage"] | order(displayOrder asc) { _id, image, caption, displayOrder }`
  );
}

export async function getFeaturedImages(): Promise<GalleryImage[]> {
  return sanityClient.fetch(
    `*[_type == "homepageFeatured"][0].images[]-> { _id, image, caption, displayOrder }`
  );
}

export async function getAbout(): Promise<AboutContent | null> {
  return sanityClient.fetch(`*[_type == "about"][0] { photo, bio }`);
}

export async function getVisitInfo(): Promise<VisitContent | null> {
  return sanityClient.fetch(`*[_type == "visitInfo"][0] { address, googleMapsUrl, hours }`);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0] { businessName, phone, email, address, socialLinks }`
  );
}
