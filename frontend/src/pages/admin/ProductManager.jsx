import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, X, ExternalLink, Upload, Image as ImageIcon, ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api, { FALLBACK_PRODUCT, FALLBACK_CHAPTERS } from '../../services/api';

export default function ProductManager() {
  const [products, setProducts] = useState([FALLBACK_PRODUCT]);
  const [chapters, setChapters] = useState(FALLBACK_CHAPTERS);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [newCaptionInput, setNewCaptionInput] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    chapter_id: 1,
    name: '',
    slug: '',
    tagline: '',
    description: '',
    details: '',
    composition: '100% Heavyweight French Terry Cotton (320 GSM)',
    care_instructions: 'Hand wash cold or delicate cycle. Lay flat to dry.',
    price: 1999,
    stock: 70,
    status: 'published',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop', caption: 'Slide 1 – Front Studio View' },
      { image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop', caption: 'Slide 2 – Back Silhouette View' },
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 14 },
      { size: 'M', stock: 22 },
      { size: 'L', stock: 16 },
      { size: 'XL', stock: 10 },
      { size: 'XXL', stock: 5 },
    ],
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (res.data?.data) {
        setProducts(res.data.data);
      }
      const cRes = await api.get('/chapters');
      if (cRes.data?.data) {
        setChapters(cRes.data.data);
      }
    } catch (err) {
      // Keep state
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStartCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setNewUrlInput('');
    setNewCaptionInput('');
    setFormData({
      chapter_id: chapters[0]?.id || 1,
      name: '',
      slug: '',
      tagline: '',
      description: '',
      details: '• 320 GSM Heavy Combed Cotton\n• Dropped shoulders\n• Blind seam hem',
      composition: '100% Combed Heavyweight Organic Cotton (320 GSM)',
      care_instructions: 'Machine wash cold inside-out on delicate cycle.',
      price: 1999,
      stock: 75,
      status: 'published',
      images: [
        { image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop', caption: 'Slide 1 – Front Studio View' },
        { image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop', caption: 'Slide 2 – Back Silhouette View' },
      ],
      sizes: [
        { size: 'XS', stock: 8 },
        { size: 'S', stock: 14 },
        { size: 'M', stock: 22 },
        { size: 'L', stock: 16 },
        { size: 'XL', stock: 10 },
        { size: 'XXL', stock: 5 },
      ],
    });
  };

  const handleStartEdit = (prod) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setNewUrlInput('');
    setNewCaptionInput('');
    setFormData({
      chapter_id: prod.chapter_id || 1,
      name: prod.name || '',
      slug: prod.slug || '',
      tagline: prod.tagline || '',
      description: prod.description || '',
      details: prod.details || '',
      composition: prod.composition || '',
      care_instructions: prod.care_instructions || '',
      price: prod.price || 1999,
      stock: prod.stock || 70,
      status: prod.status || 'published',
      images: prod.images && prod.images.length > 0
        ? prod.images.map((img) => ({
            image_url: img.image_url,
            caption: img.caption || '',
          }))
        : prod.cover_image
        ? [{ image_url: prod.cover_image, caption: 'Primary View' }]
        : [],
      sizes: prod.sizes && prod.sizes.length > 0 ? prod.sizes : [
        { size: 'XS', stock: 8 },
        { size: 'S', stock: 14 },
        { size: 'M', stock: 22 },
        { size: 'L', stock: 16 },
        { size: 'XL', stock: 10 },
        { size: 'XXL', stock: 5 },
      ],
    });
  };

  // Direct File Upload handler (one by one)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    try {
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data?.url || (res.data?.data && res.data.data.file_url);
      if (uploadedUrl) {
        const slideNumber = formData.images.length + 1;
        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              image_url: uploadedUrl,
              caption: `Slide ${slideNumber} – ${file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}`,
            },
          ],
        }));
        setMsg({ text: `Image "${file.name}" uploaded directly and added to product slides.`, type: 'success' });
      }
    } catch (err) {
      console.warn('Backend file upload fallback:', err);
      // Fallback local preview URL
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            image_url: localUrl,
            caption: `Slide ${prev.images.length + 1} – ${file.name.replace(/\.[^/.]+$/, '')}`,
          },
        ],
      }));
      setMsg({ text: `File added to product slides (preview mode).`, type: 'info' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Image by URL (one by one)
  const handleAddUrlImage = () => {
    if (!newUrlInput.trim()) return;
    const slideNumber = formData.images.length + 1;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          image_url: newUrlInput.trim(),
          caption: newCaptionInput.trim() || `Slide ${slideNumber} View`,
        },
      ],
    }));
    setNewUrlInput('');
    setNewCaptionInput('');
    setMsg({ text: 'Image added to product slide reel.', type: 'success' });
  };

  // Remove a slide
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Move slide order (left/right or up/down)
  const handleMoveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.images.length) return;
    const updated = [...formData.images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  // Set an image as primary / cover slide
  const handleSetPrimary = (index) => {
    if (index === 0) return;
    const updated = [...formData.images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  // Update caption of an individual slide
  const handleUpdateCaption = (index, newCaption) => {
    const updated = [...formData.images];
    updated[index] = { ...updated[index], caption: newCaption };
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        setMsg({ text: 'Product artifact updated in MySQL database with all slides.', type: 'success' });
      } else {
        await api.post('/products', formData);
        setMsg({ text: 'New Product artifact created in database with slide gallery.', type: 'success' });
      }
      setIsEditing(false);
      fetchProducts();
    } catch (err) {
      if (editingId) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
        );
      } else {
        setProducts((prev) => [...prev, { ...formData, id: Date.now() }]);
      }
      setIsEditing(false);
      setMsg({ text: 'Product artifact saved to state.', type: 'success' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product from the atelier catalogue?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      setMsg({ text: 'Product deleted from database.', type: 'success' });
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMsg({ text: 'Product deleted from local state.', type: 'success' });
    }
  };

  const updateSizeStock = (index, newStock) => {
    const updated = [...formData.sizes];
    updated[index].stock = Number(newStock) || 0;
    setFormData({ ...formData, sizes: updated });
  };

  return (
    <AdminLayout
      title="PRODUCT MANAGEMENT"
      subtitle="Configure pricing, sizes, inventory counts, and multi-angle serial product photography."
    >
      {msg && (
        <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex justify-between items-center">
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Action Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#77736C]">
          ATELIER ARTIFACTS: {products.length}
        </span>
        {!isEditing && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW PRODUCT</span>
          </button>
        )}
      </div>

      {/* Product Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="mb-8 border border-[#F3EFE7]/15 bg-[#222222] p-6 space-y-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#F3EFE7]/10 pb-3">
            <h3 className="font-brand text-sm uppercase tracking-wider text-[#F3EFE7] font-semibold">
              {editingId ? 'EDIT PRODUCT ARTIFACT' : 'CREATE NEW PRODUCT ARTIFACT'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[#77736C] hover:text-[#F3EFE7]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                ASSOCIATED CHAPTER
              </label>
              <select
                value={formData.chapter_id}
                onChange={(e) => setFormData({ ...formData, chapter_id: Number(e.target.value) })}
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                PRICE (INR ₹)
              </label>
              <input
                type="number"
                step="1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                PUBLICATION STATUS
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                PRODUCT NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="THE GENTLE ARMOR – OVERSIZED TEE"
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                URL SLUG
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="the-gentle-armor-oversized-tee"
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
              EDITORIAL TAGLINE
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Subtle weight. Architectural drape. Your daily shield."
              className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
            />
          </div>

          {/* Size Inventory Matrix */}
          <div className="space-y-2 border-t border-[#F3EFE7]/10 pt-4">
            <label className="text-[10px] uppercase tracking-wider text-[#B49A70] block font-semibold">
              SIZE & INVENTORY ALLOCATION (XS – XXL)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {formData.sizes.map((s, idx) => (
                <div key={s.size} className="bg-[#171717] border border-[#F3EFE7]/15 p-2 text-center">
                  <span className="text-xs font-mono font-bold text-[#F3EFE7] block mb-1">{s.size}</span>
                  <input
                    type="number"
                    min="0"
                    value={s.stock}
                    onChange={(e) => updateSizeStock(idx, e.target.value)}
                    className="w-full bg-black/40 border border-[#F3EFE7]/20 text-center text-xs py-1 text-[#B49A70] font-mono focus:outline-none font-bold"
                  />
                  <span className="text-[9px] text-[#77736C] uppercase tracking-tighter">UNITS</span>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTTOM SECTION: DIRECT FILE / IMAGE UPLOAD ONE-BY-ONE & SLIDES */}
          {/* ============================================================== */}
          <div className="border border-[#B49A70]/30 bg-[#171717] p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F3EFE7]/10 pb-3 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-[#B49A70]" />
                  <h4 className="font-brand text-xs uppercase tracking-[0.2em] text-[#F3EFE7] font-semibold">
                    PRODUCT PHOTOGRAPHY & SERIAL SLIDES
                  </h4>
                </div>
                <p className="text-[11px] text-[#77736C] font-light mt-0.5">
                  Upload images one-by-one from device or enter URLs. Users will navigate these as serial slides using <span className="font-mono text-[#B49A70]">&lt; &gt;</span> controls.
                </p>
              </div>
              <span className="text-xs font-mono text-[#B49A70] bg-[#222222] px-2.5 py-1 border border-[#B49A70]/30 self-start sm:self-auto font-bold">
                {formData.images.length} {formData.images.length === 1 ? 'SLIDE' : 'SLIDES'} CONFIGURED
              </span>
            </div>

            {/* Direct Upload Options: 1) File upload button, 2) URL input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Direct File Upload One-by-One */}
              <div className="bg-[#222222] border border-[#F3EFE7]/15 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-[#F3EFE7] uppercase tracking-wider mb-1">
                    <Upload className="w-3.5 h-3.5 text-[#B49A70]" />
                    <span>OPTION 1: DIRECT FILE UPLOAD</span>
                  </div>
                  <p className="text-[11px] text-[#77736C]">
                    Choose an image file from your computer to upload directly to the server.
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'UPLOADING TO ATELIER STORAGE...' : 'SELECT IMAGE FILE (ONE BY ONE)'}</span>
                </button>
              </div>

              {/* Option 2: Add by URL */}
              <div className="bg-[#222222] border border-[#F3EFE7]/15 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-[#F3EFE7] uppercase tracking-wider mb-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#B49A70]" />
                    <span>OPTION 2: ADD BY IMAGE URL</span>
                  </div>
                  <p className="text-[11px] text-[#77736C]">
                    Enter external high-resolution photography link and caption.
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type="url"
                    value={newUrlInput}
                    onChange={(e) => setNewUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-1.5 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCaptionInput}
                      onChange={(e) => setNewCaptionInput(e.target.value)}
                      placeholder="Caption (e.g., Detail Stitching View)"
                      className="flex-1 bg-[#171717] border border-[#F3EFE7]/15 px-3 py-1.5 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="px-4 py-1.5 bg-[#B49A70] text-[#171717] text-xs uppercase tracking-wider font-semibold hover:bg-[#F3EFE7] transition-colors cursor-pointer"
                    >
                      ADD SLIDE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Serial Slides List (One by one preview & order management) */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold block">
                CURRENT SERIAL SLIDES (REORDER WITH &lt; &gt; OR DELETE)
              </label>

              {formData.images.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#F3EFE7]/15 text-[#77736C] text-xs">
                  No images added yet. Use direct file upload or image URL above to add slides.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((img, idx) => {
                    const isPrimary = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`bg-[#222222] border p-3 flex flex-col justify-between space-y-3 relative group transition-all ${
                          isPrimary ? 'border-[#B49A70] ring-1 ring-[#B49A70]/40' : 'border-[#F3EFE7]/15'
                        }`}
                      >
                        {/* Slide Badge */}
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={`px-2 py-0.5 uppercase tracking-wider font-bold ${
                            isPrimary
                              ? 'bg-[#B49A70] text-[#171717]'
                              : 'bg-white/10 text-[#F3EFE7]'
                          }`}>
                            {isPrimary ? 'SLIDE 01 (COVER)' : `SLIDE 0${idx + 1}`}
                          </span>
                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              className="text-[#77736C] hover:text-[#B49A70] flex items-center space-x-1 cursor-pointer"
                              title="Set as first cover slide"
                            >
                              <Star className="w-3 h-3" />
                              <span className="text-[9px] uppercase">MAKE COVER</span>
                            </button>
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="w-full aspect-[4/3] bg-black overflow-hidden border border-[#F3EFE7]/10 relative">
                          <img
                            src={img.image_url}
                            alt={img.caption || `Slide ${idx + 1}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        {/* Caption Editor */}
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase text-[#77736C] font-mono block">
                            SLIDE CAPTION:
                          </label>
                          <input
                            type="text"
                            value={img.caption || ''}
                            onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                            placeholder={`Slide ${idx + 1} description`}
                            className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-2 py-1 text-[11px] text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
                          />
                        </div>

                        {/* Slide Serial Navigation Controls: < (Left) and > (Right) + Delete */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#F3EFE7]/10">
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, -1)}
                              className="p-1.5 bg-[#171717] border border-[#F3EFE7]/20 text-[#F3EFE7] hover:text-[#B49A70] hover:border-[#B49A70] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                              title="Move slide left (&lt;)"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono text-[#77736C] px-1">
                              {idx + 1}/{formData.images.length}
                            </span>
                            <button
                              type="button"
                              disabled={idx === formData.images.length - 1}
                              onClick={() => handleMoveImage(idx, 1)}
                              className="p-1.5 bg-[#171717] border border-[#F3EFE7]/20 text-[#F3EFE7] hover:text-[#B49A70] hover:border-[#B49A70] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                              title="Move slide right (&gt;)"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Remove slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-[#F3EFE7]/10">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-[#F3EFE7]/20 text-xs uppercase tracking-wider text-[#F3EFE7] hover:border-[#B49A70]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-md"
            >
              SAVE PRODUCT & SLIDES
            </button>
          </div>
        </form>
      )}

      {/* Product List */}
      <div className="border border-[#F3EFE7]/10 bg-[#222222] divide-y divide-[#F3EFE7]/10 shadow-sm">
        {products.map((prod) => (
          <div key={prod.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-20 bg-[#171717] overflow-hidden flex-shrink-0 border border-[#F3EFE7]/10 relative group">
                <img
                  src={prod.images?.[0]?.image_url || prod.cover_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop'}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                {prod.images && prod.images.length > 1 && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[#B49A70] text-[9px] font-mono px-1 font-bold">
                    {prod.images.length}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-brand text-base text-[#F3EFE7] uppercase tracking-wider font-semibold">
                    {prod.name}
                  </h4>
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    {prod.status || 'published'}
                  </span>
                  {prod.images && prod.images.length > 0 && (
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-[#B49A70]/20 text-[#B49A70] border border-[#B49A70]/30 font-mono font-bold">
                      {prod.images.length} {prod.images.length === 1 ? 'SLIDE' : 'SLIDES'}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-serif text-[#F3EFE7] font-semibold">
                    ₹{Number(prod.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[#77736C]">•</span>
                  <span className="text-[#B49A70] font-mono font-bold">
                    STOCK: {prod.stock || 70} UNITS
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#B49A70]">
                  SLUG: /products/{prod.slug}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              <a
                href={`/products/${prod.slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 border border-[#F3EFE7]/20 text-xs text-[#F3EFE7] hover:border-[#B49A70] hover:text-[#B49A70] flex items-center space-x-1 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>VIEW</span>
              </a>
              <button
                onClick={() => handleStartEdit(prod)}
                className="px-3 py-1.5 border border-[#F3EFE7]/20 text-xs text-[#F3EFE7] hover:border-[#B49A70] hover:text-[#B49A70] flex items-center space-x-1 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>EDIT</span>
              </button>
              <button
                onClick={() => handleDelete(prod.id)}
                className="px-3 py-1.5 border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10 flex items-center space-x-1 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>DELETE</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
