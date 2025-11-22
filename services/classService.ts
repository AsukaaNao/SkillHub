import { Kelas, ClassFormData, ApiResponse, ClassDetail } from '../types';

// Points to the API route we created at src/app/api/classes/route.ts
const API_URL = '/api/classes';

export const ClassService = {
  
  // GET ALL: Fetch from API
  getAllKelas: async (): Promise<ApiResponse<Kelas[]>> => {
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      return await res.json();
    } catch (e: any) {
      console.error("Fetch error:", e);
      return { success: false, error: "Failed to load classes from server" };
    }
  },

  // GET BY ID: Fetch single class details
  getKelasById: async (id: number): Promise<ApiResponse<ClassDetail>> => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { cache: 'no-store' });
      
      if (!res.ok) {
         return { success: false, error: "Class not found" };
      }

      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // CREATE: Send POST request
  createKelas: async (data: ClassFormData): Promise<ApiResponse<Kelas>> => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to create class" };
    }
  },

  // UPDATE: Send PUT request
  updateKelas: async (id: number, data: ClassFormData): Promise<ApiResponse<Kelas>> => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to update class" };
    }
  },

  // DELETE: Send DELETE request
  deleteKelas: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to delete class" };
    }
  },

  // BULK INSERT: Send POST request to /bulk endpoint
  bulkInsert: async (classes: ClassFormData[]): Promise<ApiResponse<Kelas[]>> => {
      try {
        const res = await fetch(`${API_URL}/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(classes),
        });
        
        return await res.json();
      } catch (e) {
        return { success: false, error: "Bulk insert failed" };
      }
    }
};