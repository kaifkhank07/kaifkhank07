"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Admin/Table";
import { Button } from "@/components/Admin/Button";
import { Input, Textarea } from "@/components/Admin/Input";
import Modal from "@/components/Admin/Modal";
import ConfirmDialog from "@/components/Admin/ConfirmDialog";
import { ImageUpload } from "@/components/Admin/ImageUpload";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    domain: "",
    clientName: "",
    services: "",
    liveDemoLink: "",
    challengeDescription: "",
    showOnHome: false,
    visibility: false,
    images: [] as string[]
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (err) {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: any) => {
    if (project) {
      setEditingId(project._id);
      setFormData({
        ...project,
        services: project.services.join(", "),
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "", slug: "", category: "", domain: "", clientName: "",
        services: "", liveDemoLink: "", challengeDescription: "", showOnHome: false, visibility: false, images: []
      });
    }
    setIsModalOpen(true);
  };

  const triggerDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${confirmDialog.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted");
        fetchProjects();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setConfirmDialog({ isOpen: false, id: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      services: formData.services.split(",").map(s => s.trim()).filter(Boolean),
    };

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Project ${editingId ? "updated" : "created"}`);
        setIsModalOpen(false);
        fetchProjects();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    if (formData.images.length >= 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Project
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableHeader>Title</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Slug</TableHeader>
          <TableHeader>onHome</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableHead>
        <TableBody>
          {projects.map((p) => (
            <TableRow key={p._id}>
              <TableCell className="font-semibold">{p.title}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{p.slug}</TableCell>
              <TableCell>{p.showOnHome ? "Yes" : "No"}</TableCell>
              <TableCell>{p.visibility ? "Visible" : "Hidden"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={18} /></button>
                  <button onClick={() => triggerDelete(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-zinc-500">No projects found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Project" : "New Project"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <Input label="Slug (unique)" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
            <Input label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
            <Input label="Domain" value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} />
            <Input label="Client Name" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
            <Input label="Live Demo Link" value={formData.liveDemoLink} onChange={e => setFormData({...formData, liveDemoLink: e.target.value})} />
          </div>
          <Input label="Services (comma separated)" value={formData.services} onChange={e => setFormData({...formData, services: e.target.value})} />
          <Textarea label="Challenge / Description" value={formData.challengeDescription} onChange={e => setFormData({...formData, challengeDescription: e.target.value})} />
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="showOnHome" checked={formData.showOnHome} onChange={e => setFormData({...formData, showOnHome: e.target.checked})} className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black" />
              <label htmlFor="showOnHome" className="text-sm font-semibold text-zinc-700">Show on Home Page</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="visibility" checked={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.checked})} className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black" />
              <label htmlFor="visibility" className="text-sm font-semibold text-zinc-700">Public Visibility</label>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Images (Max 3)</label>
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((img, idx) => (
                <ImageUpload key={idx} currentImage={img} onUploadSuccess={() => {}} onRemove={() => removeImage(idx)} />
              ))}
              {formData.images.length < 3 && (
                <ImageUpload onUploadSuccess={handleImageUpload} />
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Save Project</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen} 
        title="Delete Project" 
        message="Are you sure you want to delete this project? This action cannot be undone." 
        onConfirm={executeDelete} 
        onCancel={() => setConfirmDialog({ isOpen: false, id: "" })} 
        isLoading={isDeleting} 
      />
    </div>
  );
}
