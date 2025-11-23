import { ParticipantFormData, ClassFormData } from "../types";

const FIRST_NAMES = [
  "Budi", "Siti", "Agus", "Dewi", "Rina", "Joko", "Eko", "Yani", 
  "Andi", "Ratna", "Bambang", "Sri", "Hendra", "Lestari", "Dian"
];

const LAST_NAMES = [
  "Santoso", "Wijaya", "Putri", "Saputra", "Hidayat", "Susanti", 
  "Nugroho", "Pratama", "Kusuma", "Utami", "Wibowo", "Rahayu"
];

const CLASS_NAMES = [
  "Pemrograman Dasar Python",
  "Desain Grafis dengan Photoshop",
  "Digital Marketing 101",
  "Akuntansi Dasar untuk UKM",
  "Pengembangan Web Modern (React)",
  "Bahasa Inggris untuk Bisnis",
  "Analisis Data dengan Excel",
  "Public Speaking & Presentasi",
  "Manajemen Proyek Agile",
  "UI/UX Design Fundamentals"
];

const CLASS_DESCRIPTIONS = [
  "Pelajari dasar-dasar yang kuat untuk memulai karir Anda.",
  "Kelas intensif dengan materi praktik langsung.",
  "Cocok untuk pemula yang ingin meningkatkan skill.",
  "Panduan lengkap dari teori hingga implementasi.",
  "Tingkatkan produktivitas Anda dengan teknik terbaru."
];

const NAMA_PENGAJAR = ["Andi", "Budi", "Eko", "Joko", "Rina", "Siti", "Agus", "Dewi", "Ratna", "Yani"];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateDummyParticipants = (count: number): ParticipantFormData[] => {
  const results: ParticipantFormData[] = [];
  for (let i = 0; i < count; i++) {
    const first = getRandom(FIRST_NAMES);
    const last = getRandom(LAST_NAMES);
    const name = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(Math.random() * 99)}@example.com`;
    const phone = `08${Math.floor(Math.random() * 1000000000)}`;

    results.push({
      nama: name,
      email: email,
      nomor_telepon: phone
    });
  }
  return results;
};

export const generateDummyClasses = (count: number): ClassFormData[] => {
  const results: ClassFormData[] = [];
  const uniqueNames = new Set<string>();
  
  // Try to pick unique names
  while (results.length < count && uniqueNames.size < CLASS_NAMES.length) {
    const name = getRandom(CLASS_NAMES);
    if (!uniqueNames.has(name)) {
      uniqueNames.add(name);
      results.push({
        nama_kelas: name,
        deskripsi: getRandom(CLASS_DESCRIPTIONS),
        pengajar: getRandom(FIRST_NAMES)
      });
    }
  }
  return results;
};