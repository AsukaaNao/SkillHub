# SkillHub – Student & Class Management System

A full-stack **Next.js** application designed to manage students, classes, and course enrollments.  
Built using **Next.js 15 (App Router)** and **MySQL** (via XAMPP).

---

## 🚀 Prerequisites

Before starting, ensure you have:

- **Node.js (v18 or later)**
- **XAMPP** (or any MySQL server)

---

## 🛠️ Database Setup (Required)

### 1. Start XAMPP
- Open the **XAMPP Control Panel**
- Start **Apache** and **MySQL**

### 2. Create the Database
1. Visit `http://localhost/phpmyadmin`  
2. Click **New**  
3. Enter database name: **skillhub_db**  
4. Click **Create**

### 3. Create Tables
Inside **skillhub_db → SQL**, run the following:

```sql
-- 1. Participants Table
CREATE TABLE participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nomor_telepon VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Classes Table
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kelas VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enrollments Table (Junction Table)
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peserta_id INT,
    kelas_id INT,
    tanggal_pendaftaran TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (peserta_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (kelas_id) REFERENCES classes(id) ON DELETE CASCADE
);
```

## ⚙️ Configuration

Create a **`.env.local`** file in the root directory of the project and add the following environment variables:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=skillhub_db
```

## 📦 Installation & Running

### 1. Install Dependencies
Run the following command to install all required packages:

```bash
npm install
```
### 2. Start Development Server
Run the following command to launch the Next.js development server:

```bash
npm run dev
```

## ✨ Features

- **Participant Management** – Add, edit, delete, and search student records  
- **Class Management** – Create, edit, and manage classes  
- **Enrollment System** – Many-to-many relationship between students and classes  
- **Real-time Class Counts** – Displays the number of students enrolled in each class  
- **Mock Data Generator** – Quickly populate the database with sample data for testing  


