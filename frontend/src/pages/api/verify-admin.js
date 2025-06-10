export default function handler(req, res) {
  const { admin } = req.query;
  const adminSecret = process.env.ADMIN_SECRET;

  if (admin === adminSecret) {
    res.status(200).json({ access: true });
  } else {
    res.status(401).json({ access: false });
  }
  
}
