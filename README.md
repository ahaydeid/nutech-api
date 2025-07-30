# nutech-api

REST API yang dikembangkan untuk menyelesaikan tugas praktek posisi API Programmer di PT. Nutech Integrasi. Aplikasi ini menyediakan fitur registrasi, login (menggunakan JWT), cek saldo, top up, dan riwayat transaksi sesuai kontrak API (Swagger).

---

## Fitur Utama
- ✅ Registrasi user
- ✅ Login user dengan token JWT
- ✅ Cek saldo
- ✅ Top up saldo
- ✅ Histori transaksi dengan pagination

---

## Tech Stack
- Node.js + Express.js
- PostgreSQL
- JWT (JSON Web Token)
- Railway (Deployment Cloud)

---

## Struktur Folder
```
├── config/          # Konfigurasi koneksi database
├── controllers/     # Logika endpoint API
├── middleware/      # Middleware untuk otentikasi
├── routes/          # Routing untuk auth dan user
├── sql/             # Skema database (DDL)
├── .env.example     # Contoh environment variable
├── app.js           # Entry point utama aplikasi
├── server.js        # Server Express
```

---

## Instalasi & Setup
1. Clone repo:
```bash
git clone https://github.com/ahaydeid/nutech-api.git
cd nutech-api
```
2. Install dependencies:
```bash
npm install
```
3. Duplikat file environment:
```bash
cp .env.example .env
```
4. Isi file `.env`:
```env
DATABASE_URL=postgres://username:password@host:port/dbname
JWT_SECRET=your_secret_key
PORT=3000
```
5. Buat database PostgreSQL dan jalankan DDL:
```bash
psql -U postgres -d nama_database -f sql/schema.sql
```

6. Jalankan server:
```bash
npm start
```

---

## Endpoint API
Gunakan Base URL: `https://your-deploy-url/api`

| Method | Endpoint                         | Deskripsi                | Auth  |
|--------|----------------------------------|--------------------------|-------|
| POST   | `/register`                      | Registrasi user          | ❌     |
| POST   | `/login`                         | Login user, dapat token  | ❌     |
| GET    | `/balance`                       | Melihat saldo user       | ✅     |
| POST   | `/topup`                         | Menambahkan saldo        | ✅     |
| GET    | `/transaction/history?offset=0&limit=10` | Riwayat transaksi | ✅     |

Untuk endpoint yang membutuhkan autentikasi, tambahkan header:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Struktur Database
Lihat file `sql/schema.sql` untuk struktur lengkap. Tabel yang digunakan:

- `users(id, name, email, password_hash, balance, created_at)`
- `transactions(id, user_id, invoice_number, transaction_type, description, total_amount, created_on)`
