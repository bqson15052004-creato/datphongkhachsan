// Simple mock data for development without backend
export const rooms = [
  {
    id: 1,
    hotel_owner_name: 'Sunset Hotel',
    room_number: '101',
    room_type_name: 'Deluxe',
    price: 1200000,
    is_available: true,
    image: 'https://via.placeholder.com/400x300?text=Room+101'
  },
  {
    id: 2,
    hotel_owner_name: 'Seaside Resort',
    room_number: '202',
    room_type_name: 'Suite',
    price: 2500000,
    is_available: false,
    image: 'https://via.placeholder.com/400x300?text=Room+202'
  }
];

export const reviews = [
  { id: 1, room_id: 1, customer_name: 'Nguyen Van A', rating: 5, comment: 'Rất tốt', created_at: new Date().toISOString() }
];

export const user = {
  id: 1,
  username: 'demo',
  fullName: 'Demo User',
  role: 'customer',
  phone: '0123456789'
};

export const tokens = {
  access: 'mock-access-token',
  refresh: 'mock-refresh-token'
};

export function findRoomById(id) {
  return rooms.find(r => String(r.id) === String(id));
}
