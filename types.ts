// ENTITIES (Model Layer)

export interface Peserta {
  id: number;
  nama: string;
  email: string;
  nomor_telepon?: string;
  createdAt: string;
}

export interface Kelas {
  id: number;
  nama_kelas: string;
  deskripsi?: string;
  studentCount?: number;
  // instruktur field removed
  createdAt: string;
}

export interface Pendaftaran {
  id: number;
  peserta_id: number;
  kelas_id: number;
  tanggal_pendaftaran: string;
}

// COMPOUND TYPES (Joins)

export interface ClassDetail extends Kelas {
  peserta: Peserta[];
}

export interface ParticipantDetail extends Peserta {
  enrolledClasses: Kelas[];
}

// API RESPONSE TYPES (Simulating Backend Responses)

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// FORM TYPES

export interface ParticipantFormData {
  nama: string;
  email: string;
  nomor_telepon: string;
}

export interface ClassFormData {
  nama_kelas: string;
  deskripsi: string;
}