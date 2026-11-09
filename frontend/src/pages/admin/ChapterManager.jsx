import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api, { FALLBACK_CHAPTERS, FALLBACK_SERIES } from '../../services/api';

export default function ChapterManager() {
  const [chapters, setChapters] = useState(FALLBACK_CHAPTERS);
  const [seriesList, setSeriesList] = useState(FALLBACK_SERIES);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const [formData, setFormData] = useState({
    series_id: 1,
    chapter_number: 1,
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    content: '',
    cover_image: '',
    secondary_image: '',
    design_philosophy: '',
    sort_order: 1,
    status: 'published',
  });

  const fetchChapters = async () => {
    try {
      const res = await api.get('/chapters');
      if (res.data?.data) {
        setChapters(res.data.data);
      }
    } catch (err) {
      // Keep state
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleStartCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormData({
      series_id: 1,
      chapter_number: chapters.length + 1,
      title: `CHAPTER 0${chapters.length + 1} – `,
      slug: `chapter-0${chapters.length + 1}-new`,
      subtitle: '',
      description: '',
      content: '',
      cover_image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
      secondary_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
      design_philosophy: '',
      sort_order: chapters.length + 1,
      status: 'published',
    });
  };

  const handleStartEdit = (chap) => {
    setIsEditing(true);
    setEditingId(chap.id);
    setFormData({
      series_id: chap.series_id || 1,
      chapter_number: chap.chapter_number || 1,
      title: chap.title || '',
      slug: chap.slug || '',
      subtitle: chap.subtitle || '',
      description: chap.description || '',
      content: chap.content || '',
      cover_image: chap.cover_image || '',
      secondary_image: chap.secondary_image || '',
      design_philosophy: chap.design_philosophy || '',
      sort_order: chap.sort_order || 1,
      status: chap.status || 'published',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/chapters/${editingId}`, formData);
        setMsg({ text: 'Chapter updated in database successfully.', type: 'success' });
      } else {
        await api.post('/chapters', formData);
        setMsg({ text: 'New Chapter created successfully in database.', type: 'success' });
      }
      setIsEditing(false);
      fetchChapters();
    } catch (err) {
      if (editingId) {
        setChapters((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
        );
      } else {
        setChapters((prev) => [...prev, { ...formData, id: Date.now() }]);
      }
      setIsEditing(false);
      setMsg({ text: 'Chapter updated in view state.', type: 'success' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this chapter from the series chronology?')) return;
    try {
      await api.delete(`/chapters/${id}`);
      fetchChapters();
      setMsg({ text: 'Chapter deleted from database.', type: 'success' });
    } catch (err) {
      setChapters((prev) => prev.filter((c) => c.id !== id));
      setMsg({ text: 'Chapter deleted from local state.', type: 'success' });
    }
  };

  return (
    <AdminLayout
      title="CHAPTER MANAGEMENT"
      subtitle="Craft editorial narratives, design philosophies, and imagery for each episode."
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
          CHRONOLOGICAL CHAPTERS: {chapters.length}
        </span>
        {!isEditing && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW CHAPTER</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="mb-8 border border-[#F3EFE7]/15 bg-[#222222] p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#F3EFE7]/10 pb-3">
            <h3 className="font-brand text-sm uppercase tracking-wider text-[#F3EFE7] font-semibold">
              {editingId ? 'EDIT EDITORIAL CHAPTER' : 'CREATE NEW EDITORIAL CHAPTER'}
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
                PARENT SERIES
              </label>
              <select
                value={formData.series_id}
                onChange={(e) => setFormData({ ...formData, series_id: Number(e.target.value) })}
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              >
                {seriesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                CHAPTER NUMBER
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.chapter_number}
                onChange={(e) => setFormData({ ...formData, chapter_number: Number(e.target.value) })}
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
                <option value="draft">Draft (Private)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                CHAPTER TITLE
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="CHAPTER 01 – THE BEGINNING"
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
                placeholder="chapter-01-the-beginning"
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
              SUBTITLE
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="The Genesis of Vulnerability"
              className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
              SHORT SYNOPSIS
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
              FULL STORYTELLING ESSAY (PARAGRAPHS)
            </label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="In the quiet before dawn, we assemble the pieces of who we intend to be..."
              className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none font-serif text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
              DESIGN PHILOSOPHY STATEMENT
            </label>
            <textarea
              rows={2}
              value={formData.design_philosophy}
              onChange={(e) => setFormData({ ...formData, design_philosophy: e.target.value })}
              placeholder="Heavyweight organic cotton drape engineered to offer spatial protection without restriction..."
              className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                PRIMARY COVER IMAGE URL
              </label>
              <input
                type="text"
                required
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                SECONDARY LOOKBOOK IMAGE URL
              </label>
              <input
                type="text"
                value={formData.secondary_image}
                onChange={(e) => setFormData({ ...formData, secondary_image: e.target.value })}
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
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
              className="px-5 py-2 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              SAVE CHAPTER
            </button>
          </div>
        </form>
      )}

      {/* Chapters Table */}
      <div className="border border-[#F3EFE7]/10 bg-[#222222] divide-y divide-[#F3EFE7]/10 shadow-sm">
        {chapters.map((chap, idx) => (
          <div key={chap.id || idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-20 bg-[#171717] overflow-hidden flex-shrink-0 border border-[#F3EFE7]/10">
                <img
                  src={chap.cover_image}
                  alt={chap.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-[#B49A70] font-bold">
                    CH. 0{chap.chapter_number || idx + 1}
                  </span>
                  <h4 className="font-brand text-sm sm:text-base text-[#F3EFE7] uppercase tracking-wider font-semibold">
                    {chap.title}
                  </h4>
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    {chap.status || 'published'}
                  </span>
                </div>
                {chap.subtitle && (
                  <p className="text-xs text-[#77736C] font-serif italic">
                    "{chap.subtitle}"
                  </p>
                )}
                <p className="text-[11px] font-mono text-[#B49A70]">
                  SLUG: /chapters/{chap.slug}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              <a
                href={`/chapters/${chap.slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 border border-[#F3EFE7]/20 text-xs text-[#F3EFE7] hover:border-[#B49A70] hover:text-[#B49A70] flex items-center space-x-1 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>PREVIEW</span>
              </a>
              <button
                onClick={() => handleStartEdit(chap)}
                className="px-3 py-1.5 border border-[#F3EFE7]/20 text-xs text-[#F3EFE7] hover:border-[#B49A70] hover:text-[#B49A70] flex items-center space-x-1 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>EDIT</span>
              </button>
              <button
                onClick={() => handleDelete(chap.id)}
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
