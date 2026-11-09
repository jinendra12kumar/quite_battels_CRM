import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api, { FALLBACK_PRODUCT } from '../services/api';

export default function Shop() {
  const [products, setProducts] = useState([FALLBACK_PRODUCT]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data?.data?.length > 0) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.warn('Using fallback product in shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-[#F3EFE7] text-[#171717] pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Shop Header */}
        <div className="mb-14 border-b border-[#D8D0C3] pb-8 flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-[#B49A70] block mb-2 font-semibold">
              CATALOGUE OF ARTIFACTS
            </span>
            <h1 className="font-brand text-4xl sm:text-6xl text-[#171717] font-bold uppercase tracking-[0.2em]">
              THE COLLECTION
            </h1>
          </div>
          <div className="text-xs text-[#77736C] uppercase tracking-widest font-mono">
            <span>SERIES 01 // </span>
            <span className="text-[#B49A70] font-bold">{products.length} ARTIFACT AVAILABLE</span>
          </div>
        </div>

        {/* Product Grid (Cards in #E8E1D6 on #F3EFE7 ground) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((prod) => (
            <Link
              key={prod.id}
              to={`/products/${prod.slug}`}
              className="group flex flex-col bg-[#E8E1D6] border border-[#D8D0C3] hover:border-[#B49A70] transition-all duration-300 shadow-sm"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#171717]">
                <img
                  src={prod.images?.[0]?.image_url || prod.cover_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop'}
                  alt={prod.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#171717]/85 backdrop-blur-sm px-2.5 py-1 text-[10px] tracking-[0.25em] text-[#B49A70] uppercase border border-[#B49A70]/30 font-semibold">
                  SERIES 01
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-brand text-lg text-[#171717] group-hover:text-[#B49A70] transition-colors tracking-wider font-semibold">
                    {prod.name}
                  </h3>
                  <p className="font-serif text-lg text-[#171717] mt-1 font-semibold">
                    ₹{Number(prod.price).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-[#77736C] font-light mt-2 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8D0C3] flex items-center justify-between text-xs tracking-widest text-[#77736C]">
                  <span className="text-[11px] text-[#77736C] font-mono">SIZES: XS – XXL</span>
                  <span className="text-[#171717] font-semibold uppercase flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>VIEW</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B49A70]" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
