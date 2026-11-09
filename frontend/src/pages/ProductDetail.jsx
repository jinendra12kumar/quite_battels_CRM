import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api, { FALLBACK_PRODUCT } from '../services/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(FALLBACK_PRODUCT);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data?.data) {
          setProduct(res.data.data);
        } else {
          setProduct(FALLBACK_PRODUCT);
        }
      } catch (err) {
        setProduct(FALLBACK_PRODUCT);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setSelectedSize('');
    setQuantity(1);
    setSelectedImage(0);
    setSizeError(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addToCart(product, selectedSize, quantity);
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : [
        {
          id: 1,
          image_url: product.cover_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
          caption: 'Front Studio View',
        },
      ];

  const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize);
  const availableStock = currentSizeObj ? currentSizeObj.stock : product.stock || 50;

  return (
    <div className="bg-[#F3EFE7] text-[#171717] pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center space-x-2 text-[11px] uppercase tracking-[0.25em] text-[#77736C]">
          <Link to="/" className="hover:text-[#171717] transition-colors">QUIET BATTLES™</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#171717] transition-colors">SHOP</Link>
          <span>/</span>
          <span className="text-[#B49A70] font-semibold truncate">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT: Editorial Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[650px] pb-2 md:pb-0 scrollbar-none">
              {images.map((img, index) => (
                <button
                  key={img.id || index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-24 flex-shrink-0 bg-[#E8E1D6] border transition-all cursor-pointer overflow-hidden ${
                    selectedImage === index
                      ? 'border-[#171717] ring-1 ring-[#171717] opacity-100'
                      : 'border-[#D8D0C3] opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || `Product view ${index + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Large Active Image View */}
            <div className="flex-1 aspect-[4/5] bg-[#E8E1D6] border border-[#D8D0C3] overflow-hidden relative group shadow-sm">
              <img
                src={images[selectedImage]?.image_url}
                alt={images[selectedImage]?.caption || product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {images[selectedImage]?.caption && (
                <div className="absolute bottom-4 left-4 right-4 bg-[#F3EFE7]/90 backdrop-blur-sm p-3 text-[11px] font-mono text-[#171717] border border-[#D8D0C3]">
                  {images[selectedImage]?.caption}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Form */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-start">
            <div className="space-y-3 border-b border-[#D8D0C3] pb-6">
              <div className="flex items-center space-x-2 text-[10px] tracking-[0.35em] uppercase text-[#B49A70] font-semibold">
                <span>SERIES 01</span>
                <span>•</span>
                <span>THE GENTLE ARMOR™</span>
              </div>

              <h1 className="font-brand text-2xl sm:text-4xl text-[#171717] uppercase tracking-[0.16em] font-medium leading-snug">
                {product.name}
              </h1>

              <div className="flex items-baseline space-x-3 pt-1">
                <span className="font-serif text-3xl text-[#171717] font-semibold tracking-wider">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#77736C] uppercase tracking-widest">
                  (INCL. ALL TAXES)
                </span>
              </div>
            </div>

            {/* Tagline / Narrative */}
            <div className="space-y-2">
              <p className="text-sm font-serif italic text-[#171717]">
                "{product.tagline || 'Subtle weight. Architectural drape. Your daily shield.'}"
              </p>
              <p className="text-xs text-[#77736C] font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs tracking-widest uppercase">
                <span className="text-[#171717] font-semibold">SELECT SIZE</span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[#B49A70] text-[11px] cursor-pointer hover:underline uppercase tracking-wider font-medium"
                >
                  SIZE & FIT GUIDE
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {(product.sizes || [
                  { size: 'XS', stock: 8 },
                  { size: 'S', stock: 14 },
                  { size: 'M', stock: 22 },
                  { size: 'L', stock: 16 },
                  { size: 'XL', stock: 10 },
                  { size: 'XXL', stock: 5 },
                ]).map((s) => {
                  const isSelected = selectedSize === s.size;
                  const isOutOfStock = s.stock <= 0;

                  return (
                    <button
                      key={s.size}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => handleSizeSelect(s.size)}
                      className={`py-3 text-xs font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#171717] text-[#F3EFE7] border-[#171717] font-bold shadow-sm'
                          : isOutOfStock
                          ? 'border-[#D8D0C3] text-[#77736C]/40 bg-[#E8E1D6]/30 cursor-not-allowed line-through'
                          : 'border-[#D8D0C3] text-[#171717] bg-[#E8E1D6]/40 hover:border-[#171717]'
                      }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>

              {sizeError && (
                <div className="flex items-center space-x-2 text-red-600 text-xs tracking-wider uppercase pt-1 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please select a size to proceed.</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Stock Indicator */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#171717] font-medium">
                  QUANTITY
                </span>
                <span className="text-[11px] text-[#B49A70] font-mono tracking-wider font-semibold">
                  {selectedSize
                    ? `${availableStock} PIECES RESERVED IN ATELIER`
                    : 'SELECT SIZE TO CHECK STOCK'}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-[#D8D0C3] bg-[#E8E1D6]/50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-[#171717] hover:text-[#B49A70] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 text-xs font-mono text-[#171717] font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(availableStock || 10, quantity + 1))}
                    className="px-4 py-2.5 text-[#171717] hover:text-[#B49A70] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.25em] font-medium transition-all flex items-center justify-center space-x-3 cursor-pointer active:scale-[0.99] shadow-sm"
                >
                  <span>ADD TO BAG</span>
                  <span>•</span>
                  <span>₹{(Number(product.price) * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>
            </div>

            {/* Related Chapter Story Bridge */}
            {product.chapter && (
              <div className="border border-[#D8D0C3] bg-[#E8E1D6] p-4 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-[#77736C] uppercase tracking-widest block font-medium">
                    ORIGINATING CHAPTER
                  </span>
                  <span className="font-serif text-sm text-[#171717] font-medium">
                    {product.chapter.title || 'CHAPTER 01 – THE BEGINNING'}
                  </span>
                </div>
                <Link
                  to={`/chapters/${product.chapter.slug || 'chapter-01-the-beginning'}`}
                  className="text-xs uppercase tracking-widest text-[#B49A70] font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>READ STORY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Accordion / Tabbed Specifications */}
            <div className="border-t border-[#D8D0C3] pt-6 space-y-4">
              <div className="flex border-b border-[#D8D0C3] text-xs uppercase tracking-widest">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-3 pr-6 transition-colors cursor-pointer ${
                    activeTab === 'details'
                      ? 'text-[#171717] border-b-2 border-[#171717] font-semibold'
                      : 'text-[#77736C] hover:text-[#171717]'
                  }`}
                >
                  DETAILS & CRAFT
                </button>
                <button
                  onClick={() => setActiveTab('composition')}
                  className={`pb-3 px-6 transition-colors cursor-pointer ${
                    activeTab === 'composition'
                      ? 'text-[#171717] border-b-2 border-[#171717] font-semibold'
                      : 'text-[#77736C] hover:text-[#171717]'
                  }`}
                >
                  COMPOSITION
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-3 px-6 transition-colors cursor-pointer ${
                    activeTab === 'care'
                      ? 'text-[#171717] border-b-2 border-[#171717] font-semibold'
                      : 'text-[#77736C] hover:text-[#171717]'
                  }`}
                >
                  CARE & SHIPPING
                </button>
              </div>

              <div className="text-xs text-[#77736C] leading-relaxed font-light">
                {activeTab === 'details' && (
                  <div className="space-y-2 whitespace-pre-line font-mono text-[11px] text-[#171717]">
                    {product.details || `• 320 GSM heavy combed loopback French terry\n• Drop-shoulder silhouette\n• Blind seam stitching`}
                  </div>
                )}
                {activeTab === 'composition' && (
                  <p className="text-[#171717]">
                    {product.composition || '100% Heavyweight French Terry Cotton (320 GSM). Certified organic yarn.'}
                  </p>
                )}
                {activeTab === 'care' && (
                  <div className="space-y-2">
                    <p className="text-[#171717]">{product.care_instructions || 'Hand wash cold or gentle cycle. Dry flat in shade.'}</p>
                    <p className="text-[#77736C] pt-1 text-[11px]">
                      Complimentary express shipping across India. Delivered in signature archival casing within 3-5 business days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal (Ivory Card Theme #F3EFE7 / #E8E1D6) */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#F3EFE7] border border-[#D8D0C3] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#D8D0C3] pb-4">
              <div>
                <span className="text-[10px] text-[#B49A70] uppercase tracking-[0.3em] font-semibold">ATELIER MEASUREMENTS</span>
                <h3 className="font-brand text-lg text-[#171717] uppercase tracking-wider font-bold">ARCHITECTURAL FIT MATRIX</h3>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-[#77736C] hover:text-[#171717] font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#77736C] font-light leading-relaxed">
              Cut with an exaggerated drop-shoulder and generous spatial volume. We recommend selecting your standard size for the intended relaxed silhouette, or sizing down for a more traditional fit.
            </p>

            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#D8D0C3] text-[#77736C] uppercase tracking-widest text-[10px]">
                  <th className="pb-2">SIZE</th>
                  <th className="pb-2">CHEST (IN)</th>
                  <th className="pb-2">LENGTH (IN)</th>
                  <th className="pb-2">SHOULDER (IN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C3] text-[#171717]">
                <tr><td className="py-2 text-[#B49A70] font-bold">XS</td><td>44</td><td>27.5</td><td>22.0</td></tr>
                <tr><td className="py-2 text-[#B49A70] font-bold">S</td><td>46</td><td>28.5</td><td>22.5</td></tr>
                <tr><td className="py-2 text-[#B49A70] font-bold">M</td><td>48</td><td>29.5</td><td>23.0</td></tr>
                <tr><td className="py-2 text-[#B49A70] font-bold">L</td><td>50</td><td>30.5</td><td>23.5</td></tr>
                <tr><td className="py-2 text-[#B49A70] font-bold">XL</td><td>52</td><td>31.5</td><td>24.0</td></tr>
                <tr><td className="py-2 text-[#B49A70] font-bold">XXL</td><td>54</td><td>32.0</td><td>24.5</td></tr>
              </tbody>
            </table>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="px-6 py-2.5 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
