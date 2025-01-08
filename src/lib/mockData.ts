// src/lib/mockData.ts
import { getRank, getLevel } from '@/lib/utils';

export const mockUsers = [
  { id: 1, name: 'Ahmad Fauzi', points: 150, avatar: '/avatars/avatar-01.jpg' }, // Level 3 → Rekrut
  { id: 2, name: 'Budi Santoso', points: 700, avatar: '/avatars/avatar-02.jpg' }, // Level 12 → Kopral
  { id: 3, name: 'Citra Dewi', points: 2500, avatar: '/avatars/avatar-03.jpg' }, // Level 20 → Sersan
  { id: 4, name: 'Dian Pratama', points: 5000, avatar: '/avatars/avatar-04.jpg' }, // Level 26 → Letnan Dua
  { id: 5, name: 'Eka Wijaya', points: 9400, avatar: '/avatars/avatar-05.jpg' }, // Level 39 → Brigadir Jenderal
  { id: 6, name: 'Fajar Nugroho', points: 23000, avatar: '/avatars/avatar-06.jpg' }, // Level 48 → Kolonel
  { id: 7, name: 'Gita Ayu', points: 31200, avatar: '/avatars/avatar-07.jpg' }, // Level 53 → Letnan Kolonel
  { id: 8, name: 'Hendra Setiawan', points: 39100, avatar: '/avatars/avatar-08.jpg' }, // Level 58 → Mayor Jenderal
  { id: 9, name: 'Indra Kusuma', points: 42300, avatar: '/avatars/avatar-09.jpg' }, // Level 63 → Jenderal
  { id: 10, name: 'Joko Prasetyo', points: 49300, avatar: '/avatars/avatar-10.jpg' }, // Level 70 → Jenderal Besar
  { id: 11, name: 'Kartika Sari', points: 54300, avatar: '/avatars/avatar-11.jpg' }, // Level 75 → Marshal
  { id: 12, name: 'Luki Hermawan', points: 60000, avatar: '/avatars/avatar-12.jpg' }, // Level 80 → Admiral Galaksi
  { id: 13, name: 'Maya Indah', points: 65000, avatar: '/avatars/avatar-13.jpg' }, // Level 85 → Penjaga Kosmos
  { id: 14, name: 'Nina Wulandari', points: 70000, avatar: '/avatars/avatar-14.jpg' }, // Level 90 → Legenda Galaksi
].map((user) => {
  const level = getLevel(user.points); // Calculate level
  const rank = getRank(level); // Calculate rank based on level
  return { ...user, rank, level };
});
