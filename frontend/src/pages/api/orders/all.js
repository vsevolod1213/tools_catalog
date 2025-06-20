export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Метод не разрешён" });

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      phone,
      created_at,
      services,
      order_items (
        quantity,
        product:product_id (
          name,
          price
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // 👇 Преобразование в безопасный ISO-формат с Z
  const normalized = data.map((order) => ({
    ...order,
    created_at: new Date(order.created_at).toISOString(),
  }));

  return res.status(200).json({ orders: normalized });
}
