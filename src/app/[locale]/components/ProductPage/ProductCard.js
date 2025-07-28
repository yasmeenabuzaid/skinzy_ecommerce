// components/ProductCard.jsx
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => (
  <div className="group">
    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      {product.isSale && (
        <div className="absolute top-3 left-3 bg-[#d77979] text-white text-xs font-semibold px-2 py-0.5 rounded">Sale</div>
      )}
    </div>
    <div className="pt-4 text-center">
      <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
      <div className="flex justify-center items-center my-1">
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={i < product.rating ? 'currentColor' : 'none'} stroke={i < product.rating ? 'currentColor' : 'gray'} />
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
      </div>
      <p className="font-semibold">
        {product.isSale && <span className="text-gray-400 line-through mr-2">${product.originalPrice.toFixed(2)}</span>}
        <span className={product.isSale ? "text-red-500" : "text-gray-800"}>${product.price.toFixed(2)}</span>
      </p>
    </div>
  </div>
);

export default ProductCard;
