"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/utils/endpoint";
import Image from "next/image";
import { getCartSessionId, setCartSessionId } from "@/utils/helper_api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Cart Fetch Response Headers:", response.headers);
      console.log(
        "Cart Fetch Set-Cookie Header:",
        response.headers["set-cookie"]
      );
      console.log("Cart Fetch All Cookies:", document.cookie);

      const setCookieHeader = response.headers["set-cookie"];
      if (setCookieHeader) {
        const sessionMatch = setCookieHeader
          .toString()
          .match(/cart_session=([^;]+)/);
        if (sessionMatch && sessionMatch[1]) {
          setCartSessionId(sessionMatch[1]);
          console.log("New Cookie Set:", sessionMatch[1]);
        }
      }

      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div>Loading cart...</div>;
  if (!cart?.Items?.length) return <div>No items in cart</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        Shopping Cart ({cart.TotalItems} items)
      </h2>
      {cart.Items.map((item) => (
        <div
          key={item.CartItemId}
          className="flex items-center gap-4 mb-4 pb-4 border-b"
        >
          <div className="relative w-20 h-20">
            <Image
              src={item.ImageUrl || "/placeholder.jpg"}
              alt={item.ProductName}
              fill
              className="object-cover rounded"
              sizes="80px"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{item.ProductName}</h3>
            <p className="text-gray-600">
              ${item.Price.toFixed(2)} x {item.Quantity}
            </p>
          </div>
          <span className="font-bold">${item.Total.toFixed(2)}</span>
        </div>
      ))}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${cart.TotalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
