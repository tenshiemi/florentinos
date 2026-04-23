import { defineType, defineField } from 'sanity';

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'photo',
      title: 'Photo of Florentino',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'pageTitle', type: 'string', title: 'Page Title', description: 'Browser tab title, e.g. "About — Florentino\'s Fine Flowers"' }),
    defineField({ name: 'pageDescription', type: 'text', rows: 2, title: 'Meta Description' }),
  ],
});
