"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";

const OrderSummaryItem = ({ item, onRemove }) => {
  const product = item?.product;

  if (!product) return null;

  const image = product.images?.[0]?.image || "https://placehold.co/100x100";
  const name = product.name || "Unnamed";
  const price = product.price_after_discount ?? product.price ?? 0;

  return (
    <div className="flex gap-4 mb-5">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 object-cover border border-gray-200 rounded-md"
      />
      <div className="flex-grow">
        <p className="font-medium text-sm text-gray-800 mb-1">{name}</p>
        <p className="text-xs text-gray-500">
          {item.quantity} × ${price.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">Type: {product.type || "-"}</p>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default OrderSummaryItem;
