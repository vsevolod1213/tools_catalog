"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductsInCategoryPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const params = useParams();
  const { id } = params;

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
          return fetch("/api/categories");
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((res) => res.json())
      .then((data) => {
        const category = data.categories.find((c) => c.id.toString() === id);
        if (category) {
          setCategoryName(category.name);
        }
        return fetch(`/api/products?categoryId=${id}`);
      })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async (productId) => {
    if (confirm("Удалить товар?")) {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        alert("Ошибка удаления");
      }
    }
  };

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (!authorized) return <div className="p-8 text-xl font-bold">Доступ запрещён</div>;

  return (
    <div className="relative min-h-screen font-sans">
      {/* Фон */}
      <div className="absolute inset-0 -z-10">
        <Image src="/banner.png" alt="Фон баннера" fill className="brightness-75" />
      </div>

      {/* Хедер */}
      <header className="bg-black/60 text-white shadow fixed w-full z-20">
        <div className="container mx-auto flex justify-center items-center py-4 px-6">
          <nav className="flex gap-3 items-center">
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
        <div className="bg-white/70 rounded-lg shadow-md p-6 backdrop-blur-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Товары в категории: {categoryName}
          </h1>
          <div className="text-center mb-4">
            <Link
              href={`/admin/add-product?admin=${adminCode}&categoryId=${id}`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow transition"
            >
              ➕ Добавить товар
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-center text-gray-700">Товаров нет.</p>
          ) : (
            <ul className="mt-4">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="border-b py-2 flex justify-between items-center"
                >
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full shadow"
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
