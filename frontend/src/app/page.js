"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
function ProductCard({ product, onAdd, onRemove, getQuantity }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.image_urls.length);
    }, 2000);
    return () => clearInterval(id);
  }, [product.image_urls.length]);

  return (
    <div className="relative h-full">
      <div className="relative group h-full">
        <div className="relative transition-transform duration-300 group-hover:scale-105 group-hover:z-50 group-hover:shadow-2xl bg-white/90 rounded-lg p-4 backdrop-blur-md flex flex-col justify-between">
          <div>
            {/* Квадратное изображение со слайдером */}
            <div className="relative w-full aspect-square overflow-hidden mb-4 rounded bg-gray-300">
              <Image
                src={product.image_urls[currentImage] || "/fallback.png"}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-700 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-32 transition-all duration-300 overflow-hidden">
              {product.description}
            </p>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div className="font-bold text-xl text-green-700">{product.price} ₽</div>
            {getQuantity(product.id) === 0 ? (
              <button
                onClick={() => onAdd(product)}
                className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
              >
                В корзину
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemove(product)}
                  className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-700 transition"
                >
                  −
                </button>
                <span className="w-6 text-center">{getQuantity(product.id)}</span>
                <button
                  onClick={() => onAdd(product)}
                  className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-700 transition"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [isSticky, setIsSticky] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [phone, setPhone] = useState("");

  const getTotalPrice = () =>
    cart.reduce((sum, p) => {
      const prod = products.find((x) => x.id === p.id);
      return sum + (prod?.price ?? 0) * p.quantity;
    }, 0);


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

  const getQuantity = (productId) => {
    const item = cart.find((p) => p.id === productId);
    return item ? item.quantity : 0;
  };

  const increment = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { id: product.id, quantity: 1 }];
      }
    });
  };

  const decrement = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        );
      }
    });
  };

  const handleSubmitOrder = async () => {
    if (!phone.trim()) {
      alert("Введите номер телефона");
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          items: cart,
        }),
      });

      if (!response.ok) throw new Error("Ошибка при оформлении заказа");

      alert("Заказ отправлен!");
      setCart([]);
      setPhone("");
      setShowCart(false);
    } catch (err) {
      alert("Ошибка при оформлении заказа");
    }
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
        <div className="container mx-auto px-4 py-3">
          {/* MOBILE (base) layout */}
          <div className="block sm:hidden space-y-3">
            {/* Центрированные кнопки */}
            <nav className="flex justify-center gap-2 flex-wrap text-sm">
              <div className="relative group">
                <button className="px-4 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition">
                  Каталог
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
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
                className="px-4 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
              >
                Услуги
              </a>

              <button
                onClick={() => setShowCart(true)}
                className="px-4 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
              >
                Корзина ({cart?.reduce((sum, p) => sum + p.quantity, 0)})
              </button>
            </nav>

            {/* Телефон по центру */}
            <div className="text-center text-xs text-gray-200">
              Номер для связи:{" "}
              <span className="text-white font-semibold">+7 (812) 345 25-25</span>
            </div>

            {/* Поисковая строка — только если isSticky */}
            {isSticky && (
              <div className="w-full px-2 transition-all duration-700">
                <input
                  type="text"
                  placeholder="Поиск товаров"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-white/40 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-black shadow-md backdrop-blur-md"
                />
              </div>
            )}
          </div>

          {/* DESKTOP layout (sm and up) */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Кнопки слева */}
            <nav className="flex gap-2 text-sm">
              <div className="relative group">
                <button className="px-4 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition">
                  Каталог
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
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
                className="px-4 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
              >
                Услуги
              </a>

              <button
                onClick={() => setShowCart(true)}
                className="min-w-[110px] px-4 py-2 bg-orange-600/70 hover:bg-orange-600/90 text-white rounded-full shadow transition"
              >
                Корзина ({cart?.reduce((sum, p) => sum + p.quantity, 0)})
              </button>
            </nav>

            {/* Поиск по центру при isSticky */}
            {isSticky && (
              <div className="absolute left-1/2 -translate-x-1/2 top-[16px] w-full max-w-[320px] transition-all duration-700">
                <input
                  type="text"
                  placeholder="Поиск товаров"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-white/40 border border-gray-300 rounded-full px-6 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-black shadow-md backdrop-blur-md"
                />
              </div>
            )}

            {/* Номер справа */}
            <div className="text-gray-200 text-sm whitespace-nowrap">
              Номер для связи:{" "}
              <span className="text-white font-semibold">+7 (812) 345 25-25</span>
            </div>
          </div>
        </div>
      </header>



      
      {/* ВНЕШНЯЯ строка только когда не липкая */}
      {!isSticky && (
        <div className="fixed top-[100px] sm:top-[72px] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-30 transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[transform,opacity]">
          <input
            type="text"
            placeholder="Поиск товаров"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[transform,opacity] bg-white/40 border border-gray-300 rounded-full px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 text-black shadow-md backdrop-blur-md w-full"
          />
        </div>
      )}




      <main className={`pb-32 px-6 container mx-auto ${isSticky ? 'pt-40' : 'pt-45'}`}>
        {categories.map((cat) => (
          <section key={cat.id} id={`category-${cat.id}`} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {cat.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-0 min-h-[100px]">

              {filteredProducts
                .filter((p) => p.category_id === cat.id)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={increment}
                    onRemove={decrement}
                    getQuantity={getQuantity}
                  />
                ))}

            </div>
          </section>
        ))}
      </main>
      {showCart && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>
            <ul className="mb-4 max-h-60 overflow-y-auto">
              {cart.map((item) => {
                const prod = products.find((p) => p.id === item.id);
                return (
                  <li key={item.id} className="flex justify-between mb-2">
                    <span>{prod?.name}</span>
                    <span>{item.quantity} × {prod?.price} ₽</span>
                  </li>
                );
              })}
            </ul>
            <p className="font-bold mb-2">Итого: {getTotalPrice()} ₽</p>
            <input
              type="tel"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCart(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmitOrder}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
              >
                Сделать заказ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
