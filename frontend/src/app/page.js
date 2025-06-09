"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Page() {
  const [isSticky, setIsSticky] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="container mx-auto flex flex-wrap justify-between items-center py-4 px-6">
          {/* Левое меню */}
          <nav className="flex flex-wrap gap-3 items-center">
            <div className="relative group">
              <button className="px-6 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition">
                Каталог
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Электрический
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Бензиновый
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Ручной
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Аксессуары
                </a>
              </div>
            </div>
            <a href="#" className="px-6 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition">
              Услуги
            </a>
            <a href="#" className="px-6 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition">
              🛒 Корзина
            </a>
          </nav>

          {/* Поиск в хедере */}
          <div
            className={`transition-all duration-700 ease-in-out transform ${
              isSticky
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            } absolute left-1/2 -translate-x-1/2 top-full mt-[-28px] w-full max-w-md`}
          >
            <input
              type="text"
              placeholder="Поиск товаров"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-white/40 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black shadow-md backdrop-blur-md"
            />
          </div>

          {/* Телефон */}
          <div className="text-gray-200 font-medium hidden sm:block ml-auto">
            Номер для связи:{" "}
            <span className="text-white font-semibold">
              +7 (812) 345 25-25
            </span>
          </div>
        </div>
      </header>

      {/* Основной блок */}
      <main className="pt-40 px-6 container mx-auto">
        {/* Поиск в основном блоке */}
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

        {/* Каталог */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(20).keys()].map((item) => (
            <div
              key={item}
              className="bg-white/70 rounded-lg shadow-md p-4 backdrop-blur-md"
            >
              <div className="h-40 bg-gray-300 rounded mb-2"></div>
              <h3 className="text-lg font-semibold">Товар {item + 1}</h3>
              <p className="text-sm text-gray-700">Описание товара</p>
              <button className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition">
                Подробнее
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
