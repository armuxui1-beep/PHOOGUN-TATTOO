export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  artist: string;
  style: string;
  size: string;
  note: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface InventoryItem {
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  status: 'OK' | 'LOW';
}

export interface GalleryItem {
  id: string;
  category: string;
  name: string;
  artist: string;
  imageUrl: string;
  description: string;
}

export interface FinancialTransaction {
  trxId: string;
  date: string;
  time: string;
  title: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'Pending' | 'Success';
  artist?: string;
}

export interface SystemTicket {
  id: string;
  category: string;
  title: string;
  details: string;
  status: 'Checking' | 'Resolved';
  createdAt: string;
}

export interface Artist {
  id: string;
  nameTh: string;
  nameEn: string;
  specialty: string;
  imageUrl: string;
  experience: string;
  availability: string;
}

export interface ClientReview {
  id: string;
  author: string;
  rating: number;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  artist?: string;
}
