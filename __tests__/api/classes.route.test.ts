import { GET, POST } from '@/app/api/classes/route';
import { GET as GET_ONE, PUT, DELETE } from '@/app/api/classes/[id]/route';

// 1. MOCK NEXT.JS RESPONSE
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      async json() { return data; },
      data,
    })),
  },
}));

// 2. MOCK DATABASE
jest.mock('@/lib/db', () => {
  const queryMock = jest.fn();
  return {
    __esModule: true,
    default: { query: queryMock },
  };
});

import pool from '@/lib/db';

describe('Feature: Class Management', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // READ (GET)
  // ==========================================
  describe('GET /api/classes', () => {
    it('Read: Successfully retrieves all classes with student counts', async () => {
      const mockClasses = [{ id: 1, nama_kelas: 'React 101', studentCount: 5 }];
      (pool.query as jest.Mock).mockResolvedValueOnce([mockClasses]);

      const response: any = await GET();
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.data[0].nama_kelas).toBe('React 101');
    });
  });

  // ==========================================
  // READ ONE (GET /id)
  // ==========================================
  describe('GET /api/classes/[id]', () => {
    const params = Promise.resolve({ id: '1' });

    it('Read Detail: Successfully retrieves class details and enrolled students', async () => {
      const mockClass = { id: 1, nama_kelas: 'React 101' };
      const mockStudents = [{ id: 5, nama: 'Student A' }];

      (pool.query as jest.Mock)
        .mockResolvedValueOnce([ [mockClass] ])  // Query 1: Class info
        .mockResolvedValueOnce([ mockStudents ]); // Query 2: Students

      const response: any = await GET_ONE({} as any, { params });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.data.peserta).toHaveLength(1);
    });
  });

  // ==========================================
  // CREATE (POST)
  // ==========================================
  describe('POST /api/classes', () => {
    it('Create: Successfully creates a new class', async () => {
      const body = { nama_kelas: 'Next.js', pengajar: 'Mr. Smith', deskripsi: 'Advanced' };
      const req: any = { json: jest.fn().mockResolvedValue(body) };
      
      (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 10 }]);

      const response: any = await POST(req);
      expect(response.status).toBe(200);
    });
  });

  // ==========================================
  // UPDATE (PUT)
  // ==========================================
  describe('PUT /api/classes/[id]', () => {
    const params = Promise.resolve({ id: '1' });

    it('Update: Successfully updates class information', async () => {
      const body = { nama_kelas: 'Next.js Pro', pengajar: 'Mr. Smith', deskripsi: 'Updated' };
      const req: any = { json: jest.fn().mockResolvedValue(body) };
      
      (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response: any = await PUT(req, { params });
      expect(response.status).toBe(200);
    });
  });

  // ==========================================
  // DELETE (DELETE)
  // ==========================================
  describe('DELETE /api/classes/[id]', () => {
    const params = Promise.resolve({ id: '1' });

    it('Delete: Successfully deletes a class', async () => {
      const req: any = {};
      (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response: any = await DELETE(req, { params });
      expect(response.status).toBe(200);
    });
  });
});