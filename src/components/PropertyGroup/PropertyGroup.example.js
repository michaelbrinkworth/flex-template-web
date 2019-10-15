import PropertyGroup from './PropertyGroup';


const categories = [
    { key: 'Balloon Styling', label: 'Balloon Styling' },
  { key: 'Marquee & Canopy', label: 'Marquee & Canopy' },
  { key: 'Photo Booth', label: 'Photo Booth' },
  { key: 'Jumping Castles', label: 'Jumping Castles' },
  { key: 'Event Furniture', label: 'Event Furniture' },
  { key: 'Venues', label: 'Venues' },
  { key: 'Platters', label: 'Platters' },
];


const types = [
//Jumping Castle Types
    {
      key: 'Frozen',
      label: 'Frozen',
    },
    {
      key: 'Slide',
      label: 'Slide',
    },
    {
      key: 'Paw Patrol',
      label: 'Paw Patrol',
       },
//Photobooths
{
  key: 'Open-Air',
  label: 'Open-Air',
},
{
  key: 'Traditional',
  label: 'Traditional',
},
{
  key: 'Mirrorless',
  label: 'Mirrorless',
   },
   {
     key: 'GIF-maker',
     label: 'GIF-maker',
      },
 ];

export const WithSomeSelected = {
  component: PropertyGroup,
  props: {
    id: 'Marquee & Canopy',
    options: categories,
    selectedOptions: ['GIF-maker', 'Open-Air', 'Mirrorless'],
    twoColumns: true,
  },
  group: 'misc',
};
