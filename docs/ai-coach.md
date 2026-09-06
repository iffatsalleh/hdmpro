# Spesifikasi AI Coach & Sistem RAG HDM

AI Coach dalam HDMPro bertindak sebagai antara muka cerdas antara perbualan harian pengguna dan sistem data berstruktur.

---

## 1. Alat Pelayan Terkawal (Server-Side Tools)

AI Coach tidak mempunyai kebenaran untuk menjalankan sebarang arahan SQL bebas. Sebaliknya, interaksi dihadkan kepada alat terkawal (*function calling*):

1. **`log_food`**: Menerima jenis hidangan, nama menu, kalori, dan protein. Menghantar kepada `DietService`.
2. **`log_weight`**: Menerima bacaan berat badan dan mengemas kini profil fizikal semasa.
3. **`get_today_progress`**: Menghitung baki kalori, protein, dan peratusan kemajuan sasaran.
4. **`get_weight_history`**: Mengambil sejarah bacaan timbangan terkini.

---

## 2. Pangkalan Pengetahuan RAG (Retrieval-Augmented Generation)

Untuk memastikan AI Coach sentiasa mematuhi metodologi rasmi Hardcore Diet Mastery:
* Dokumen rasmi dipecahkan kepada *chunks* kecil (~500 aksara).
* Semasa pengguna bertanya soalan mengenai defisit, protein, atau mengatasi kebuntuan berat badan (*plateau*), sistem membuat carian relevan pada cebisan dokumen berstatus `PUBLISHED`.
* Hasil rujukan disuntik ke dalam konteks panduan AI (`system prompt`) sebelum jawapan dijana.
