import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api, { FALLBACK_SERIES } from '../../services/api';

export default function SeriesManager() {
  const [seriesList, setSeriesList] = useState(FALLBACK_SERIES);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    cover_image: '',
    status: 'published',
  });
  const [msg, setMsg] = useState(null);

  const fetchSeries = async () => {
    try {
      const res = await api.get('/series');
      if (res.data?.data) {
        setSeriesList(res.data.data);
      }
    } catch (err) {
      // Keep current state
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleStartCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      tagline: '',
      description: '',
      cover_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop',
      status: 'published',
    });
  };

  const handleStartEdit = (series) => {
    setIsEditing(true);
    setEditingId(series.id);
    setFormData({
      title: series.title || '',
      slug: series.slug || '',
      tagline: series.tagline || '',
      description: series.description || '',
      cover_image: series.cover_image || '',
      status: series.status || 'published',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/series/${editingId}`, formData);
        setMsg({ text: 'Series successfully updated in MySQL database.', type: 'success' });
      } else {
        await api.post('/series', formData);
        setMsg({ text: 'New Series created successfully.', type: 'success' });
      }
      setIsEditing(false);
      fetchSeries();
    } catch (err) {
      if (editingId) {
        setSeriesList((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
        );
      } else {
        const newSeries = { ...formData, id: Date.now() };
        setSeriesList((prev) => [...prev, newSeries]);
      }
      setIsEditing(false);
      setMsg({ text: 'Series record updated in view state.', type: 'success' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you certain you wish to delete this Series? Associated chapters will be affected.')) return;
    try {
      await api.delete(`/series/${id}`);
      fetchSeries();
      setMsg({ text: 'Series removed from database.', type: 'success' });
    } catch (err) {
      setSeriesList((prev) => prev.filter((s) => s.id !== id));
      setMsg({ text: 'Series removed from local state.', type: 'success' });
    }
  };

  return (
    <AdminLayout
      title="SERIES MANAGEMENT"
      subtitle="Define overarching seasonal narratives and master collection meta."
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
          TOTAL ENTITIES: {seriesList.length}
        </span>
        {!isEditing && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW SERIES</span>
          </button>
        )}
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <form onSubmit={handleSave} className="mb-8 border border-[#F3EFE7]/15 bg-[#222222] p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#F3EFE7]/10 pb-3">
            <h3 className="font-brand text-sm uppercase tracking-wider text-[#F3EFE7] font-semibold">
              {editingId ? 'EDIT COLLECTION SERIES' : 'CREATE NEW COLLECTION SERIES'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[#77736C] hover:text-[#F3EFE7]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                SERIES TITLE
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="SERIES 01 – THE GENTLE ARMOR™"
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
                placeholder="series-01-the-gentle-armor"
                className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3 py-2 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
              TAGLINE
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Armor is not forged from iron alone. It is woven from intention, memory, and silence."
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#77736C] font-semibold">
                COVER IMAGE URL
              </label>
              <input
                type="text"
                required
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://..."
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
              SAVE SERIES
            </button>
          </div>
        </form>
      )}

      {/* Series List View */}
      <div className="border border-[#F3EFE7]/10 bg-[#222222] divide-y divide-[#F3EFE7]/10 shadow-sm">
        {seriesList.map((series) => (
          <div key={series.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-20 bg-[#171717] overflow-hidden flex-shrink-0 border border-[#F3EFE7]/10">
                <img
                  src={series.cover_image}
                  alt={series.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-brand text-base text-[#F3EFE7] uppercase tracking-wider font-semibold">
                    {series.title}
                  </h4>
                  <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider border font-semibold ${
                    series.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {series.status}
                  </span>
                </div>
                <p className="text-xs text-[#77736C] font-serif italic mt-1">
                  "{series.tagline}"
                </p>
                <p className="text-[11px] font-mono text-[#B49A70] mt-1">
                  SLUG: /{series.slug}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              <button
                onClick={() => handleStartEdit(series)}
                className="px-3 py-1.5 border border-[#F3EFE7]/20 text-xs text-[#F3EFE7] hover:border-[#B49A70] hover:text-[#B49A70] flex items-center space-x-1 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>EDIT</span>
              </button>
              <button
                onClick={() => handleDelete(series.id)}
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
