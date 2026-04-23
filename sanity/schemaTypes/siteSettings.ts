import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'businessName', type: 'string', title: 'Business Name' }),
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
  ],
});
