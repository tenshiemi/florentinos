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
      ],
    }),
  ],
});
