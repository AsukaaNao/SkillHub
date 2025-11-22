import { Peserta, ApiResponse, ParticipantFormData, ParticipantDetail } from '../types';

// We point to the API routes we created (or will create) in src/app/api/...
const API_URL = '/api/participants';

export const ParticipantService = {
  
  // GET ALL: Fetch from the API
  getAll: async (): Promise<ApiResponse<ParticipantDetail[]>> => {
    try {
      // 'no-store' ensures we don't get cached/stale data
      const res = await fetch(API_URL, { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      
      return await res.json();
    } catch (error: any) {
      console.error("Failed to fetch participants:", error);
      return { success: false, error: "Failed to load participants from server" };
    }
  },

  // CREATE: Send POST request
  create: async (formData: ParticipantFormData): Promise<ApiResponse<Peserta>> => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      return await res.json();
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to create participant" };
    }
  },

  // UPDATE: Send PUT request
  update: async (id: number, formData: ParticipantFormData): Promise<ApiResponse<Peserta>> => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      return await res.json();
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to update participant" };
    }
  },

  // DELETE: Send DELETE request
  delete: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      return await res.json();
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to delete participant" };
    }
  },

  // BULK INSERT: Send POST request to /bulk endpoint
  bulkInsert: async (participants: ParticipantFormData[]): Promise<ApiResponse<Peserta[]>> => {
    try {
      const res = await fetch(`${API_URL}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participants),
      });

      return await res.json();
    } catch (error: any) {
      return { success: false, error: "Bulk insert failed" };
    }
  }
};