import { defineType, defineField } from 'sanity';

export const homepageFeatured = defineType({
  name: 'homepageFeatured',
  title: 'Homepage Featured',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Featured Images (max 4)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'galleryImage' }] }],
      validation: (Rule) => Rule.max(4),
    }),
  ],
});
