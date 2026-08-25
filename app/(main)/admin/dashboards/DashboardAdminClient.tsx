"use client";

import { useState, useTransition } from "react";
import { ExternalDashboard } from "@prisma/client";
import { 
  createExternalDashboard, 
  updateExternalDashboard, 
  deleteExternalDashboard,
  updateDashboardHeaderConfig 
} from "@/app/actions/dashboards";
import { Plus, Edit2, Trash2, Link as LinkIcon, Image as ImageIcon, Save, CheckCircle2 } from "lucide-react";

interface HeaderConfig {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

export default function DashboardAdminClient({ 
  initialDashboards,
  initialHeaderConfig 
}: { 
  initialDashboards: ExternalDashboard[];
  initialHeaderConfig: HeaderConfig;
}) {
  const [dashboards, setDashboards] = useState(initialDashboards);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(initialHeaderConfig);
  const [headerSaved, setHeaderSaved] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    order: 0,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", imageUrl: "", linkUrl: "", order: 0, isActive: true });
    setEditingId(null);
  };

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setHeaderConfig({ ...headerConfig, imageUrl: dataUrl });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleHeaderSave = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateDashboardHeaderConfig(headerConfig);
      if (res.success) {
        setHeaderSaved(true);
        setTimeout(() => setHeaderSaved(false), 3000);
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setFormData({ ...formData, imageUrl: dataUrl });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const openModal = (dashboard?: ExternalDashboard) => {
    if (dashboard) {
      setEditingId(dashboard.id);
      setFormData({
        title: dashboard.title,
        description: dashboard.description || "",
        imageUrl: dashboard.imageUrl || "",
        linkUrl: dashboard.linkUrl,
        order: dashboard.order,
        isActive: dashboard.isActive,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editingId) {
        const res = await updateExternalDashboard(editingId, formData);
        if (res.success && res.data) {
          setDashboards(dashboards.map(d => d.id === editingId ? res.data : d).sort((a, b) => a.order - b.order));
        }
      } else {
        const res = await createExternalDashboard(formData);
        if (res.success && res.data) {
          setDashboards([...dashboards, res.data].sort((a, b) => a.order - b.order));
        }
      }
      setIsModalOpen(false);
      resetForm();
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this dashboard?")) {
      startTransition(async () => {
        const res = await deleteExternalDashboard(id);
        if (res.success) {
          setDashboards(dashboards.filter(d => d.id !== id));
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-10">
      {/* Header Config Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Page Header & Side Image Banner</h2>
            <p className="text-sm text-slate-500 mt-1">Configure the main heading text, description, and side image displayed on the Program Implementation page.</p>
          </div>
          {headerSaved && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Header Saved!
            </div>
          )}
        </div>

        <form onSubmit={handleHeaderSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Header Title</label>
                <input 
                  required 
                  type="text" 
                  value={headerConfig.title} 
                  onChange={e => setHeaderConfig({...headerConfig, title: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Header Description</label>
                <textarea 
                  rows={3} 
                  value={headerConfig.description} 
                  onChange={e => setHeaderConfig({...headerConfig, description: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm leading-relaxed" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Optional Side Image Destination Link</label>
                <input 
                  type="url" 
                  value={headerConfig.linkUrl} 
                  onChange={e => setHeaderConfig({...headerConfig, linkUrl: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm" 
                  placeholder="https:// (optional link when clicking side image)" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Heading Side Image</label>
              <div className="space-y-3">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                  {headerConfig.imageUrl ? (
                    <img src={headerConfig.imageUrl} alt="Header Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 text-sm flex items-center gap-2">
                      <ImageIcon className="w-6 h-6" /> No image selected
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleHeaderImageUpload}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-600 hover:file:bg-amber-100 cursor-pointer"
                  />
                  <input 
                    type="url" 
                    value={headerConfig.imageUrl} 
                    onChange={e => setHeaderConfig({...headerConfig, imageUrl: e.target.value})} 
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" 
                    placeholder="Or paste image URL (https://...)" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all text-sm"
            >
              <Save className="w-4 h-4" /> {isPending ? "Saving Header..." : "Save Header Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* Program Implementation Dashboards List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Program Implementation Dashboards</h1>
            <p className="text-slate-500 text-sm mt-1">Manage individual analytical dashboard links, titles, descriptions, and thumbnails.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-all text-sm font-bold shadow-md shadow-amber-500/20"
          >
            <Plus className="w-5 h-5" /> Add Dashboard
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-xs uppercase text-slate-500">Order</th>
                <th className="p-4 font-semibold text-xs uppercase text-slate-500">Dashboard</th>
                <th className="p-4 font-semibold text-xs uppercase text-slate-500">Status</th>
                <th className="p-4 font-semibold text-xs uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboards.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">No dashboards configured yet.</td>
                </tr>
              ) : (
                dashboards.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-slate-500 font-mono text-sm">{d.order}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {d.imageUrl ? (
                          <img src={d.imageUrl} alt={d.title} className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {d.title}
                            <a href={d.linkUrl} target="_blank" rel="noreferrer" className="text-amber-500 hover:text-amber-600">
                              <LinkIcon className="w-4 h-4" />
                            </a>
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-md mt-0.5">{d.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${d.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {d.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(d)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors" disabled={isPending}>
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors ml-1" disabled={isPending}>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-xl shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Dashboard" : "Add New Dashboard"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dashboard Link URL</label>
                <input required type="url" value={formData.linkUrl} onChange={e => setFormData({...formData, linkUrl: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" placeholder="https://" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
                <div className="flex items-center gap-4">
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                  )}
                  <div className="flex-1 space-y-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-600 hover:file:bg-amber-100 cursor-pointer"
                    />
                    <div className="text-xs text-slate-400 font-medium px-1">OR paste an Image URL:</div>
                    <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" placeholder="https://" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
                </div>
                <div className="flex-1 flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Is Active?</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={isPending} className="px-5 py-2.5 rounded-xl font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2">
                  {isPending ? "Saving..." : (editingId ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

