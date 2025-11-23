import { POST, DELETE } from '@/app/api/enrollments/route';

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

describe('Feature: Student Enrollment', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // ENROLL (POST)
  // ==========================================
  describe('POST /api/enrollments', () => {
    it('Enroll: Successfully enrolls a student in multiple classes', async () => {
      const body = { pesertaId: 1, kelasIds: [101, 102] };
      const req: any = { json: jest.fn().mockResolvedValue(body) };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce([ [] ]) // Class 101: Not enrolled yet
        .mockResolvedValueOnce([ { insertId: 1 } ]) // Insert 101
        .mockResolvedValueOnce([ [] ]) // Class 102: Not enrolled yet
        .mockResolvedValueOnce([ { insertId: 2 } ]); // Insert 102

      const response: any = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.message).toBe('Enrollment successful');
      expect(pool.query).toHaveBeenCalledTimes(4);
    });

    it('Enroll: Skips classes where student is already enrolled', async () => {
      const body = { pesertaId: 1, kelasIds: [101] };
      const req: any = { json: jest.fn().mockResolvedValue(body) };

      // Mock return: Student is already in this class
      (pool.query as jest.Mock).mockResolvedValueOnce([ [{ id: 99 }] ]);

      const response: any = await POST(req);
      expect(response.status).toBe(200);
      // Should check (SELECT) but NOT insert
      expect(pool.query).toHaveBeenCalledTimes(1); 
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'), expect.anything()
      );
    });

    it('Enroll: Validation fails when data is missing', async () => {
      const body = { pesertaId: null, kelasIds: [] };
      const req: any = { json: jest.fn().mockResolvedValue(body) };

      const response: any = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  // ==========================================
  // UNENROLL (DELETE)
  // ==========================================
  describe('DELETE /api/enrollments', () => {
    it('Unenroll: Successfully removes a student from a class', async () => {
      const body = { pesertaId: 1, kelasId: 101 };
      const req: any = { json: jest.fn().mockResolvedValue(body) };

      (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }]);

      const response: any = await DELETE(req);
      expect(response.status).toBe(200);
    });

    it('Unenroll: Returns 404 if the enrollment record does not exist', async () => {
      const body = { pesertaId: 99, kelasId: 99 };
      const req: any = { json: jest.fn().mockResolvedValue(body) };

      (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }]);

      const response: any = await DELETE(req);
      expect(response.status).toBe(404);
    });
  });
});