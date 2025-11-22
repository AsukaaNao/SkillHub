import { Pendaftaran, ApiResponse } from '../types';

export const EnrollmentService = {
  
  // Create Enrollment (Existing)
  createEnrollment: async (pesertaId: number, kelasIds: number[]): Promise<ApiResponse<Pendaftaran[]>> => {
    try {
        const res = await fetch('/api/enrollments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesertaId, kelasIds }),
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        return await res.json();

    } catch (e: any) {
        return { success: false, error: e.message || "Enrollment failed" };
    }
  },

  // NEW: Delete Enrollment (Unenroll a student from a class)
  deleteEnrollment: async (pesertaId: number, kelasId: number): Promise<ApiResponse<null>> => {
    try {
        const res = await fetch('/api/enrollments', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesertaId, kelasId }),
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        return await res.json();

    } catch (e: any) {
        return { success: false, error: e.message || "Unenrollment failed" };
    }
  }
};