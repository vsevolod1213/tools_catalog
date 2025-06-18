"use client";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

function RequestsPageInner() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [adminCode, setAdminCode] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("admin");
    setAdminCode(code);

    if (!code) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    fetch(`/api/verify-admin?admin=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          setAuthorized(true);
          fetch("/api/orders/all")
            .then((res) => res.json())
            .then((data) => setOrders(data.orders || []));
        } else {
          setAuthorized(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8">Проверка доступа...</div>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Доступ запрещён.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans">
      {/* Фон */} 
      <div className="absolute inset-0 -z-10">
        <Image
          src="/banner.png"
          alt="Фон баннера"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
      </div>

      {/* Хедер */}
      <header className="bg-black/60 text-white shadow fixed w-full z-20">
        <div className="container mx-auto flex justify-center items-center py-4 px-6">
          <nav className="flex flex-wrap gap-3 items-center">
            <Link
              href={`/admin/store?admin=${adminCode}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              🛒 Управление магазином
            </Link>
            <Link
              href={`/admin/requests?admin=${adminCode}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              📑 Приём заявок
            </Link>
          </nav>
        </div>
      </header>

      {/* Контент */}
      <main className="pt-40 px-6 container mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Список заказов</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">Заказов пока нет</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const total = order.order_items.reduce(
                (sum, item) =>
                  sum + item.quantity * (item.product?.price ?? 0),
                0
              );

              return (
                <div
                  key={order.id}
                  className="bg-white/70 backdrop-blur-md p-4 rounded shadow-md"
                >
                  <div className="text-sm text-gray-600 mb-2">
                    📞 {order.phone} — 🕒{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                  <ul className="mb-2">
                    {order.order_items.map((item, idx) => (
                      <li key={idx} className="text-gray-800">
                        {item.product?.name} — {item.quantity} ×{" "}
                        {item.product?.price} ₽
                      </li>
                    ))}
                  </ul>
                  <div className="font-bold text-green-700">
                    {order.services?.length > 0 && (
                        <div className="text-sm text-gray-800 mb-1">
                            🛠 Услуги: {order.services.join(", ")}
                        </div>
                        )}

                    Итого: {total} ₽
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<div className="p-8">Загрузка админки...</div>}>
      <RequestsPageInner />
    </Suspense>
  );
}
