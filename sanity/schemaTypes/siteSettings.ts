import { defineType, defineField } from 'sanity';

const seoFields = (page: string) => [
  defineField({ name: 'title', type: 'string', title: `${page} Page Title` }),
  defineField({ name: 'description', type: 'text', rows: 2, title: `${page} Meta Description` }),
];

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'businessName', type: 'string', title: 'Business Name' }),
    defineField({ name: 'tagline', type: 'string', title: 'Tagline', description: 'Short location line shown in the footer, e.g. "Madison Valley · Seattle"' }),
    defineField({ name: 'deliveryLine', type: 'string', title: 'Delivery Coverage Line', description: 'Shown in the homepage hero, e.g. "Daily delivery to Seattle · Bellevue · Redmond · Des Moines"' }),
    defineField({ name: 'phone', type: 'string', title: 'Phone Number' }),
    defineField({ name: 'email', type: 'string', title: 'Email Address' }),
    defineField({ name: 'address', type: 'string', title: 'Street Address' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram URL' },
        { name: 'facebook', type: 'url', title: 'Facebook URL' },
        { name: 'yelp', type: 'url', title: 'Yelp URL' },
      ],
    }),
    defineField({
      name: 'glsImage',
      title: 'Gilded Lily Society Image',
      type: 'image',
      description: 'Photo shown beside the Gilded Lily Society section on the homepage.',
      options: { hotspot: true },
    }),
    defineField({ name: 'seoHome',      title: 'SEO — Home',      type: 'object', fields: seoFields('Home') }),
    defineField({ name: 'seoGallery',   title: 'SEO — Gallery',   type: 'object', fields: seoFields('Gallery') }),
    defineField({ name: 'seoOrder',     title: 'SEO — Order',     type: 'object', fields: seoFields('Order') }),
    defineField({ name: 'seoSubscribe', title: 'SEO — Subscribe', type: 'object', fields: seoFields('Subscribe') }),
  ],
});
