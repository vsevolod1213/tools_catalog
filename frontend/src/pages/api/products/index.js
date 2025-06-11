import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ products: data });
  }

  if (req.method === 'POST') {
    const { name, description, price, image_url, category_id } = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, image_url, category_id }])
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ product: data[0] });
  }

  res.status(405).json({ error: 'Метод не разрешён' });
}
