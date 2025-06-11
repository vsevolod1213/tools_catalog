"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

function ProductsPageInner() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [adminCode, setAdminCode] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("admin");
    setAdminCode(code);

    if (!code) {
      setLoading(false);
      setAuthorized(false);
      return;
    }

    fetch(`/api/verify-admin?admin=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          setAuthorized(true);
          fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
              setProducts(data.products);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          setAuthorized(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Удалить товар?")) {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Ошибка удаления товара.");
      }
    }
  };

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
              href={`/admin/categories?admin=${adminCode}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              🗂️ Управление категориями
            </Link>
            <Link
              href={`/admin/products?admin=${adminCode}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              📦 Управление товарами
            </Link>
            <Link
              href={`/admin/requests?admin=${adminCode}`}
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              📑 Прием заявок
            </Link>
          </nav>
        </div>
      </header>

      {/* Основной блок */}
      <main className="pt-40 px-6 container mx-auto">
        <div className="bg-white/70 rounded-lg shadow-md p-6 backdrop-blur-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Управление товарами
          </h1>
          <div className="text-center mb-4">
            <Link
              href={`/admin/add-product?admin=${adminCode}`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow transition"
            >
              ➕ Добавить товар
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-center text-gray-700">Товары не найдены.</p>
          ) : (
            <ul className="mt-4">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="border-b py-2 flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {product.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      Цена: {product.price}
                    </span>
                    <span className="text-sm text-gray-600">
                      {product.description}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/edit-product/${product.id}?admin=${adminCode}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-full shadow"
                    >
                      ✏️ Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8">Загрузка товаров...</div>}>
      <ProductsPageInner />
    </Suspense>
  );
}
