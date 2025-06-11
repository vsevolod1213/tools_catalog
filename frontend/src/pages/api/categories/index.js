import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ categories: data });
  }

  if (req.method === 'POST') {
    const { name, description } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, description }])
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ category: data[0] });
  }

  res.status(405).json({ error: 'Метод не разрешён' });
}
