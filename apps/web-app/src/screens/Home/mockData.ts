// Simple mock data for stores
export const stores = [
  {
    id: 1,
    name: 'Pharmacy',
    category: 'Order Medicine',
    rating: 4.5,
    distance: '1.2 km',
    image: '',
    popular: ['Paracetamol', 'Cough Syrup'],
    catalog: [
      { id: 101, name: 'Paracetamol', price: 50, category: 'Medicine', image: '' },
      { id: 102, name: 'Cough Syrup', price: 120, category: 'Medicine', image: '' },
    ],
  },
  {
    id: 2,
    name: 'Grocery Mart',
    category: 'Order Groceries',
    rating: 4.2,
    distance: '2.5 km',
    image: '',
    popular: ['Rice', 'Wheat'],
    catalog: [
      { id: 201, name: 'Rice', price: 60, category: 'Grocery', image: '' },
      { id: 202, name: 'Wheat', price: 40, category: 'Grocery', image: '' },
    ],
  },
  {
    id: 3,
    name: 'Veggie Shop',
    category: 'Order Vegies',
    rating: 4.7,
    distance: '0.8 km',
    image: '',
    popular: ['Tomato', 'Potato'],
    catalog: [
      { id: 301, name: 'Tomato', price: 30, category: 'Vegetable', image: '' },
      { id: 302, name: 'Potato', price: 20, category: 'Vegetable', image: '' },
    ],
  },
];
