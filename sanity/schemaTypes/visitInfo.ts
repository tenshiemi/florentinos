import { defineType, defineField } from 'sanity';

export const visitInfo = defineType({
  name: 'visitInfo',
  title: 'Visit Info',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps Embed URL',
      type: 'url',
    }),
    defineField({ name: 'pageTitle', type: 'string', title: 'Page Title', description: 'Browser tab title, e.g. "Visit — Florentino\'s Fine Flowers"' }),
    defineField({ name: 'pageDescription', type: 'text', rows: 2, title: 'Meta Description' }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'day', type: 'string', title: 'Day' },
          { name: 'hours', type: 'string', title: 'Hours (e.g. 10 AM – 3 PM or Closed)' },
        ],
        preview: {
          select: { title: 'day', subtitle: 'hours' },
        },
      }],
    }),
  ],
});
