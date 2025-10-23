import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { supabase } from './supabaseClient.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Untuk parsing body JSON

// === ROUTES ===

// Pengecekan dasar
app.get('/', (req, res) => {
  res.send('API Layanan Cuci Sepatu Aktif!');
});

// CREATE: Menambah data cucian baru
app.post('/items', async (req, res) => {
  const { customer_name, shoe_type, service_type } = req.body;

  if (!customer_name || !service_type) {
    return res.status(400).json({ error: 'Nama pelanggan dan jenis layanan wajib diisi' });
  }

  const { data, error } = await supabase
    .from('items')
    .insert([
      { customer_name, shoe_type, service_type, status: 'Diterima' } // Status default
    ])
    .select();

  if (error) {
    console.error('Error Supabase:', error);
    return res.status(500).json({ error: error.message });
  }
  
  res.status(201).json(data[0]);
});

// READ: Mengambil semua data (dengan filter status)
app.get('/items', async (req, res) => {
  const { status } = req.query;

  let query = supabase.from('items').select('*').order('created_at', { ascending: false });

  // Terapkan filter jika ada
  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error Supabase:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

// READ: Mengambil data spesifik berdasarkan ID
app.get('/items/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single(); // .single() untuk mengambil satu objek saja

  if (error) {
    console.error('Error Supabase:', error);
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: 'Item tidak ditemukan' });
  }

  res.status(200).json(data);
});

// UPDATE: Mengubah data (termasuk status)
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { customer_name, shoe_type, service_type, status } = req.body;

  const { data, error } = await supabase
    .from('items')
    .update({ customer_name, shoe_type, service_type, status })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error Supabase:', error);
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Item tidak ditemukan' });
  }

  res.status(200).json(data[0]);
});

// DELETE: Menghapus data
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error Supabase:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Item berhasil dihapus' });
});


// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});