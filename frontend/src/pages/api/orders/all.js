import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Метод не разрешён" });

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      phone,
      created_at,
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

  return res.status(200).json({ orders: data });
}
