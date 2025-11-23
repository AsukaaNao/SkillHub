import { GET, POST } from '@/app/api/participants/route';
import { PUT, DELETE } from '@/app/api/participants/[id]/route';
import { POST as BULK_POST } from '@/app/api/participants/bulk/route'; 

// 1. MOCK NEXT.JS RESPONSE
// This ensures we don't rely on the actual Next.js server environment
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

describe('Feature: Participant Management', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // READ (GET)
  // ==========================================
  describe('GET /api/participants', () => {
    it('Read: Successfully retrieves all participants with their enrolled classes', async () => {
      const mockParticipants = [{ id: 1, nama: 'John Doe', email: 'john@example.com' }];
      const mockEnrollments = [{ peserta_id: 1, id: 101, nama_kelas: 'Math', deskripsi: 'Basic' }];

      (pool.query as jest.Mock)
        .mockResolvedValueOnce([mockParticipants]) 
        .mockResolvedValueOnce([mockEnrollments]); 

      const response: any = await GET();
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.data[0].enrolledClasses).toHaveLength(1);
      expect(json.data[0].enrolledClasses[0].nama_kelas).toBe('Math');
    });

    it('Read: Handles database errors gracefully', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database connection failed'));
      const response: any = await GET();
      expect(response.status).toBe(500);
    });
  });

  // ==========================================
  // CREATE (POST)
  // ==========================================
  describe('POST /api/participants', () => {
    it('Create: Successfully adds a new participant', async () => {
      const body = { nama: 'Jane Doe', email: 'jane@example.com', nomor_telepon: '123' };
      const req: any = { json: jest.fn().mockResolvedValue(body) };
      
      (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 99 }]);

      const response: any = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.data.id).toBe(99);
    });

    it('Create: Fails when invalid JSON is provided', async () => {
      const req: any = { json: jest.fn().mockRejectedValue(new Error('Invalid JSON')) };
      const response: any = await POST(req);
      expect(response.status).toBe(500);
    });
  });

  // ==========================================
  // UPDATE (PUT)
  // ==========================================
  describe('PUT /api/participants/[id]', () => {
    const params = Promise.resolve({ id: '1' });

    it('Update: Successfully modifies existing participant details', async () => {
      const body = { nama: 'Jane Updated', email: 'jane@test.com', nomor_telepon: '999' };
      const req: any = { json: jest.fn().mockResolvedValue(body) };
      
      (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response: any = await PUT(req, { params });
      expect(response.status).toBe(200);
    });

    it('Update: Returns 404 if the participant ID does not exist', async () => {
      const req: any = { json: jest.fn().mockResolvedValue({}) };
      (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }]);

      const response: any = await PUT(req, { params });
      expect(response.status).toBe(404);
    });
  });

  // ==========================================
  // DELETE (DELETE)
  // ==========================================
  describe('DELETE /api/participants/[id]', () => {
    const params = Promise.resolve({ id: '1' });

    it('Delete: Successfully removes a participant', async () => {
      const req: any = {}; // DELETE usually has no body
      (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response: any = await DELETE(req, { params });
      expect(response.status).toBe(200);
    });
  });

  // ==========================================
  // BULK IMPORT (POST)
  // ==========================================
  describe('POST /api/participants/bulk', () => {
    it('Bulk: Successfully imports users and skips duplicates', async () => {
      const body = [
        { nama: 'Existing', email: 'exist@test.com' }, 
        { nama: 'New', email: 'new@test.com' }
      ];
      const req: any = { json: jest.fn().mockResolvedValue(body) };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce([ [{ id: 1 }] ]) // Found existing
        .mockResolvedValueOnce([ [] ])          // New user not found
        .mockResolvedValueOnce([ { insertId: 2 } ]); // Insert new

      const response: any = await BULK_POST(req);
      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledTimes(3);
    });
  });
});