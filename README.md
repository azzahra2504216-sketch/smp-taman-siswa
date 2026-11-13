# Portal Kemitraan — SMP Taman Siswa

Proyek website berbasis React + Vite hasil ekspor Google AI Studio. Identitas sekolah telah disesuaikan menjadi **SMP Taman Siswa**.

## Menjalankan lokal

Persyaratan: Node.js 20.19+ atau 22.12+.

```bash
npm install
npm run dev
```

## Deploy ke Cloudflare Pages melalui GitHub

- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

Hubungkan repository GitHub ke Cloudflare Pages. Cloudflare akan memasang dependencies dan menjalankan build secara otomatis.

## Catatan

Data siswa, nilai, presensi, agenda, dan pesan pada prototipe ini menggunakan data contoh/mock di sisi browser. Jangan masukkan data pribadi atau data siswa sungguhan sebelum autentikasi, backend, dan pengamanan data diterapkan.
