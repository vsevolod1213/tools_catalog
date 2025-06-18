import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { phone, items, services } = req.body;

    if (!phone || !items || items.length === 0) {
      return res.status(400).json({ error: 'Неверные данные заказа' });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ phone, services }]) 
      .select()
      .single();

    if (orderError) return res.status(500).json({ error: orderError.message });

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) return res.status(500).json({ error: itemsError.message });

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Метод не разрешён' });
}
