# Nutech API

REST API yang dikembangkan untuk menyelesaikan tugas praktek posisi API Programmer di **PT. Nutech Integrasi**.

Aplikasi ini menyediakan fitur:

- Registrasi dan login user menggunakan JWT
- Pengelolaan profil
- Informasi layanan dan banner
- Cek saldo dan top up
- Transaksi dan riwayat transaksi

API ini sesuai dengan kontrak Swagger yang telah ditentukan.

---

## 🚀 Fitur Utama

- ✅ Registrasi user
- ✅ Login dengan token JWT
- ✅ Update profil & upload foto
- ✅ Cek saldo
- ✅ Top up saldo
- ✅ Transaksi
- ✅ Riwayat transaksi

---

## 🧰 Tech Stack

- **Node.js** + **Express.js**
- **PostgreSQL**
- **JWT (JSON Web Token)**
- **Railway** (untuk deployment cloud)

---

## 📁 Struktur Folder

```
├── config/          # Konfigurasi koneksi database
├── controllers/     # Logika masing-masing endpoint
├── middleware/      # Middleware untuk autentikasi dan lainnya
├── routes/          # Routing untuk auth, user, transaksi, dll
├── sql/             # File skema database (DDL)
├── .env             # File environment variable
├── server.js        # Entry point utama aplikasi
```

---

## ⚙️ Instalasi & Setup Lokal

1. **Clone repo:**

```bash
git clone https://github.com/ahaydeid/nutech-api.git
cd nutech-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Salin file environment:**

```bash
cp .env.example .env
```

4. **Edit file **``** sesuai kebutuhan:**

```
DATABASE_URL=postgres://username:password@host:port/nutech-api
JWT_SECRET=supersecretjwtkeyyangpanjangbanget123
PORT=3000
```

5. **Buat database dan jalankan skema:**

```bash
psql -U postgres -d nama_database -f sql/schema.sql
```

6. **Jalankan server:**

```bash
npm start
```

---

## 📡 Endpoint API

**Base URL:** `https://nutech-api-production-6ff2.up.railway.app/`

### 🔐 Modul Membership

| Method | Endpoint          | Deskripsi                 | Auth |
| ------ | ----------------- | ------------------------- | ---- |
| POST   | `/register`       | Registrasi user           | ❌   |
| POST   | `/login`          | Login dan dapatkan token  | ❌   |
| GET    | `/profile`        | Lihat profil user         | ✅   |
| PUT    | `/profile/update` | Update data profil        | ✅   |
| PUT    | `/profile/image`  | Upload/update foto profil | ✅   |

### 📢 Modul Informasi

| Method | Endpoint    | Deskripsi            | Auth |
| ------ | ----------- | -------------------- | ---- |
| GET    | `/banner`   | Ambil banner         | ✅   |
| GET    | `/services` | Ambil daftar layanan | ✅   |

### 💰 Modul Transaksi

| Method | Endpoint                                 | Deskripsi         | Auth |
| ------ | ---------------------------------------- | ----------------- | ---- |
| GET    | `/balance`                               | Cek saldo         | ✅   |
| POST   | `/topup`                                 | Top up saldo      | ✅   |
| POST   | `/transaction`                           | Lakukan transaksi | ✅   |
| GET    | `/transaction/history?offset=0&limit=10` | Riwayat transaksi | ✅   |

> Untuk endpoint yang memerlukan autentikasi, tambahkan header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 🗃️ Struktur Database

Lihat file `sql/schema.sql` untuk struktur lengkap. Berikut ringkasan dari tabel-tabel utama:

### `users`

| Kolom         | Tipe Data    | Keterangan                      |
| ------------- | ------------ | ------------------------------- |
| id            | INTEGER      | Primary key, auto-increment     |
| email         | VARCHAR(100) | Unik, wajib                     |
| first_name    | VARCHAR(50)  | Wajib                           |
| last_name     | VARCHAR(50)  | Wajib                           |
| password      | TEXT         | Password yang sudah di-hash     |
| balance       | INTEGER      | Default 0                       |
| created_at    | TIMESTAMP    | Default: waktu saat data dibuat |
| profile_image | TEXT         | URL foto profil (opsional)      |

### `services`

| Kolom          | Tipe Data | Keterangan                  |
| -------------- | --------- | --------------------------- |
| id             | INTEGER   | Primary key, auto-increment |
| service_code   | TEXT      | Kode unik layanan           |
| service_name   | TEXT      | Nama layanan                |
| service_icon   | TEXT      | URL ikon layanan            |
| service_tariff | INTEGER   | Tarif layanan               |

### `banners`

| Kolom        | Tipe Data | Keterangan                    |
| ------------ | --------- | ----------------------------- |
| id           | INTEGER   | Primary key, auto-increment   |
| banner_name  | TEXT      | Nama banner                   |
| banner_image | TEXT      | URL gambar banner             |
| description  | TEXT      | Deskripsi tambahan (opsional) |

### `transactions`

| Kolom            | Tipe Data   | Keterangan                            |
| ---------------- | ----------- | ------------------------------------- |
| id               | INTEGER     | Primary key, auto-increment           |
| user_id          | INTEGER     | Foreign key ke `users.id`             |
| invoice_number   | VARCHAR(50) | Nomor unik transaksi                  |
| transaction_type | VARCHAR(20) | Jenis transaksi (misal: pulsa, game)  |
| description      | TEXT        | Keterangan transaksi                  |
| total_amount     | INTEGER     | Jumlah nominal                        |
| created_at       | TIMESTAMP   | Waktu transaksi, default: saat dibuat |

---

## 📞 Kontak

Untuk pertanyaan lebih lanjut, hubungi [Ahadi](mailto:adi.hadi270@gmail.com).
