"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Page() {
  const [isSticky, setIsSticky] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Ошибка загрузки категорий:", err));

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
      })
      .catch((err) => console.error("Ошибка загрузки товаров:", err));
  }, []);

  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, products]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <div className="relative min-h-screen font-sans">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/banner.png"
          alt="Фон баннера"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
      </div>

      <header className="bg-black/60 text-white shadow fixed w-full z-20">
        <div className="container mx-auto flex flex-wrap justify-between items-center py-4 px-6">
          <nav className="flex flex-wrap gap-3 items-center">
            <div className="relative group">
              <button className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition">
                Каталог
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`#category-${cat.id}`}
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      {cat.name}
                    </a>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500">Нет категорий</p>
                )}
              </div>
            </div>
            <a
              href="#"
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              Услуги
            </a>
            <a
              href="#"
              className="px-6 py-3 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
            >
              🛒 Корзина ({cart.length})
            </a>
          </nav>

          <div
            className={`transition-all duration-100 ease-in-out transform ${
              isSticky ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } absolute left-1/2 -translate-x-1/2 top-full mt-[-65px] w-full max-w-md`}
          >
            <input
              type="text"
              placeholder="Поиск товаров"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-white/40 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black shadow-md backdrop-blur-md"
            />
          </div>
<div className="text-gray-200 font-medium hidden sm:block ml-auto">
            Номер для связи: <span className="text-white font-semibold">+7 (812) 345 25-25</span>
          </div>
        </div>
      </header>

      <main className="pt-40 px-6 container mx-auto">
        {!isSticky && (
          <div className="w-full max-w-md mx-auto mb-8 transition-all duration-700">
            <input
              type="text"
              placeholder="Поиск товаров"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-white/40 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black shadow-md backdrop-blur-md"
            />
          </div>
        )}

        {categories.map((cat) => (
          <section key={cat.id} id={`category-${cat.id}`} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{cat.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts
                .filter((p) => p.category_id === cat.id)
                .map((product) => (
                  <div
                    key={product.id}
                    className="group transition-transform hover:scale-[1.02] bg-white/80 rounded-lg shadow-md p-4 backdrop-blur-md flex flex-col"
                  >
                    <div className="w-full h-40 rounded bg-gray-300 overflow-hidden mb-4 flex-shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={300}
                          height={160}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-700 group-hover:block hidden">{product.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="font-bold text-xl text-green-700">
                        {product.price} ₽
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}