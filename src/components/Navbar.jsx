"use client";
import Link from "next/link";
import Cart from "./Cart";
import { useState } from "react";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Store
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/products" className="hover:text-blue-500">
            Products
          </Link>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative hover:text-blue-500"
          >
            Cart
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-96">
                <Cart />
              </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
