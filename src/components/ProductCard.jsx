import Image from "next/image";
import axios from "axios";
import { API_URL } from "@/utils/endpoint";
import { getCartSessionId, setCartSessionId } from "@/utils/helper_api";

export default function ProductCard({ product, onAddToCart }) {
  const mainImage =
    product.images.find((img) => img.IsMainImage) || product.images[0];

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        {
          ProductId: product.ProductID,
          Quantity: 1,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // عرض كل الهيدرز من الاستجابة
      console.log("Cart Add Response Headers:", response.headers);
      console.log(
        "Cart Add Set-Cookie Header:",
        response.headers["set-cookie"]
      );
      console.log("Cart Add All Cookies:", document.cookie);

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

      if (onAddToCart) onAddToCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={mainImage?.ImageURL || "/placeholder.jpg"}
          alt={mainImage?.AltText || product.ProductName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.ProductName}</h2>
        <p className="text-gray-600 mb-2 line-clamp-2">{product.Description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            ${product.SellPrice.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
