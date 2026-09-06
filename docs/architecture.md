# Seni Bina Sistem HDMPro

Dokumen ini memperincikan corak seni bina dan lapisan perisian platform HDMPro.

---

## 1. Corak Lapisan Berstruktur (Clean Layered Architecture)

Untuk memastikan kod mudah diselenggara dan diuji, tiada logik perniagaan diletakkan terus dalam komponen UI.

```text
Antara Muka Pengguna (Client & Server Components)
               ↓
    Tindakan Pelayan (Server Actions) / Laluan API
               ↓
        Lapisan Servis (Services)
   [Logik Perniagaan & Validasi Zod]
               ↓
      Lapisan Repositori (Repositories)
   [Operasi Akses Data Pangkalan Data]
               ↓
       Prisma ORM & PostgreSQL
```

### Contoh Aliran Log Makanan:
```text
Coach UI / Dashboard Modal
   ↓ (Input Natural Language / Form)
Server Action: logFoodAction()
   ↓
DietService: logFood() -> Validasi makro, Tambah rekod XP (+10 XP)
   ↓
DietRepository: createDietLog()
   ↓
Prisma -> PostgreSQL
```

---

## 2. Struktur Modul & Direktori

* **`src/app`**: Laluan halaman (App Router) dibahagi kepada `(auth)`, `(member)`, dan `admin`.
* **`src/components/ui`**: Komponen asas reka bentuk token (`Button`, `Card`, `Input`, `BottomNav`, `TopBar`).
* **`src/lib`**: Konfigurasi perkhidmatan luar (Prisma client singleton, Stripe, Brevo, AI tools).
* **`src/services`**: Lapisan perkhidmatan logik perniagaan teras (`user`, `diet`, `weight`, `progress`, `coach`, `knowledge`, `module`, `rank`, `subscription`, `email`).
* **`src/repositories`**: Lapisan capaian entiti Prisma.
