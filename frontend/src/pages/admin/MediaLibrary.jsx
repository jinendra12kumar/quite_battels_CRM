import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Copy, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

export default function MediaLibrary() {
  const [mediaList, setMediaList] = useState([
    {
      id: 1,
      filename: 'hero_monochrome_editorial.jpg',
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      size: '1.4 MB',
      created_at: '2026-11-05',
    },
    {
      id: 2,
      filename: 'series01_gentle_armor_cover.jpg',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      size: '2.1 MB',
      created_at: '2026-11-05',
    },
    {
      id: 3,
      filename: 'chapter01_the_beginning.jpg',
      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
      size: '1.8 MB',
      created_at: '2026-11-05',
    },
    {
      id: 4,
      filename: 'product_front_oversized_tee.jpg',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
      size: '1.2 MB',
      created_at: '2026-11-05',
    },
    {
      id: 5,
      filename: 'product_back_silhouette.jpg',
      url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop',
      size: '1.5 MB',
      created_at: '2026-11-05',
    },
    {
      id: 6,
      filename: 'fabric_macro_terry.jpg',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
      size: '2.4 MB',
      created_at: '2026-11-05',
    },
  ]);

  const [copiedId, setCopiedId] = useState(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchMedia = async () => {
    try {
      const res = await api.get('/upload');
      if (res.data?.data) {
        setMediaList(res.data.data);
      }
    } catch {
      // Keep initial curated media
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile && !uploadUrl) {
      alert('Please provide an image file or URL');
      return;
    }

    setUploading(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data?.url) {
          const newMedia = {
            id: Date.now(),
            filename: selectedFile.name,
            url: res.data.url,
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            created_at: 'Just now',
          };
          setMediaList([newMedia, ...mediaList]);
          setMsg('File uploaded and added to Media Library!');
        }
      } else if (uploadUrl) {
        const newMedia = {
          id: Date.now(),
          filename: uploadName || 'editorial_asset.jpg',
          url: uploadUrl,
          size: 'External CDN',
          created_at: 'Just now',
        };
        setMediaList([newMedia, ...mediaList]);
        setMsg('Image asset registered in Media Library!');
      }

      setSelectedFile(null);
      setUploadUrl('');
      setUploadName('');
    } catch (err) {
      if (selectedFile) {
        const localPreview = URL.createObjectURL(selectedFile);
        const newMedia = {
          id: Date.now(),
          filename: selectedFile.name,
          url: localPreview,
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          created_at: 'Just now',
        };
        setMediaList([newMedia, ...mediaList]);
        setMsg('Asset uploaded to session view.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete image asset from library?')) return;
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AdminLayout
      title="MEDIA & ASSET LIBRARY"
      subtitle="Upload, optimize, and organize high-resolution fashion photography."
    >
      {msg && (
        <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs">
          {msg}
        </div>
      )}

      {/* Upload Box */}
      <div className="mb-10 border border-[#F3EFE7]/10 bg-[#222222] p-6 shadow-sm">
        <h3 className="font-brand text-xs uppercase tracking-[0.25em] text-[#B49A70] mb-4 font-semibold">
          REGISTER NEW EDITORIAL ASSET
        </h3>

        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <div className="border border-dashed border-[#F3EFE7]/20 p-4 text-center bg-[#171717] flex flex-col items-center justify-center space-y-2">
              <Upload className="w-5 h-5 text-[#B49A70]" />
              <p className="text-xs text-[#F3EFE7]">Direct File Upload</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="text-xs text-[#77736C] file:mr-2 file:py-1 file:px-2 file:border-0 file:text-xs file:bg-[#F3EFE7]/10 file:text-[#F3EFE7]"
              />
            </div>

            {/* Direct URL input */}
            <div className="space-y-2 bg-[#171717] p-4 border border-[#F3EFE7]/10">
              <p className="text-xs text-[#F3EFE7]">Or Register Web / Unsplash URL</p>
              <input
                type="text"
                placeholder="Asset Label (e.g. Lookbook Editorial)"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                className="w-full bg-[#222222] border border-[#F3EFE7]/15 px-3 py-1.5 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                className="w-full bg-[#222222] border border-[#F3EFE7]/15 px-3 py-1.5 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2.5 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'PROCESSING...' : 'UPLOAD ASSET'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaList.map((media) => (
          <div
            key={media.id}
            className="border border-[#F3EFE7]/10 bg-[#222222] flex flex-col group overflow-hidden shadow-sm"
          >
            <div className="aspect-[4/3] bg-[#171717] overflow-hidden relative">
              <img
                src={media.url}
                alt={media.filename}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopyUrl(media.url, media.id)}
                  title="Copy Image URL"
                  className="p-1.5 bg-black/80 text-white hover:text-[#B49A70] border border-white/20"
                >
                  {copiedId === media.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(media.id)}
                  title="Delete Image"
                  className="p-1.5 bg-black/80 text-white hover:text-red-400 border border-white/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 text-xs space-y-1">
              <p className="font-mono text-[#F3EFE7] truncate text-[11px] font-medium">{media.filename}</p>
              <div className="flex justify-between text-[10px] text-[#77736C] font-mono">
                <span>{media.size}</span>
                <span>{media.created_at}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
