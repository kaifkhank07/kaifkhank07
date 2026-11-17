"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Admin/Table";
import { Button } from "@/components/Admin/Button";
import { Input, Textarea, Select } from "@/components/Admin/Input";
import Modal from "@/components/Admin/Modal";
import ConfirmDialog from "@/components/Admin/ConfirmDialog";
import { ImageUpload } from "@/components/Admin/ImageUpload";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { ProjectCategory } from "@/lib/constants/project";

interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  myRole?: string;
  services?: string[];
  liveDemoLink?: string;
  challengeDescription?: string;
  showOnHome?: boolean;
  visibility?: boolean;
  images?: string[];
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [serviceInput, setServiceInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: Object.values(ProjectCategory)[0] as string,
    myRole: "",
    services: [] as string[],
    liveDemoLink: "",
    challengeDescription: "",
    showOnHome: false,
    visibility: false,
    images: [] as string[],
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: ProjectItem) => {
    setServiceInput("");
    if (project) {
      setEditingId(project._id);
      setFormData({
        title: project.title || "",
        category: project.category || Object.values(ProjectCategory)[0],
        myRole: project.myRole || "",
        services: project.services || [],
        liveDemoLink: project.liveDemoLink || "",
        challengeDescription: project.challengeDescription || "",
        showOnHome: !!project.showOnHome,
        visibility: !!project.visibility,
        images: project.images || [],
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        category: Object.values(ProjectCategory)[0],
        myRole: "",
        services: [],
        liveDemoLink: "",
        challengeDescription: "",
        showOnHome: false,
        visibility: false,
        images: [],
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
    } catch {
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
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploadMultiple = (newUrls: string[]) => {
    setFormData((prev) => {
      const remainingSlots = 4 - prev.images.length;
      if (remainingSlots <= 0) {
        toast.error("Maximum 4 images allowed");
        return prev;
      }
      const toAdd = newUrls.slice(0, remainingSlots);
      if (newUrls.length > remainingSlots) {
        toast.error(`Only ${remainingSlots} image(s) added. Maximum 4 images allowed.`);
      }
      return { ...prev, images: [...prev.images, ...toAdd] };
    });
  };

  const handleImageUpload = (url: string) => {
    handleImageUploadMultiple([url]);
  };

  const removeImage = async (index: number) => {
    const imgToRemove = formData.images[index];
    if (imgToRemove && (imgToRemove.startsWith("http") || imgToRemove.includes("/api/uploads/"))) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: imgToRemove }),
        });
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddService = () => {
    const trimmed = serviceInput.trim();
    if (!trimmed) return;
    if (formData.services.includes(trimmed)) {
      toast.error("Service already added");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, trimmed],
    }));
    setServiceInput("");
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
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
                  <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"><Pencil size={18} /></button>
                  <button onClick={() => triggerDelete(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer"><Trash2 size={18} /></button>
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
            <Input label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
              options={Object.values(ProjectCategory).map(cat => ({ label: cat, value: cat }))}
              required
            />
            <Input label="My Role" value={formData.myRole} onChange={e => setFormData({ ...formData, myRole: e.target.value })} placeholder="e.g. Lead Full Stack Developer" className="col-span-2" />
            <Input label="Live Demo Link" value={formData.liveDemoLink} onChange={e => setFormData({ ...formData, liveDemoLink: e.target.value })} className="col-span-2" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Services</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddService();
                  }
                }}
                placeholder="Enter service name (e.g. Frontend Development)"
                className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              />
              <Button type="button" onClick={handleAddService} variant="secondary">
                Add
              </Button>
            </div>
            {formData.services.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-zinc-100 text-sm px-3 py-1.5 rounded-md border border-zinc-200">
                    <span className="font-medium text-zinc-700">{service}</span>
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Textarea label="Challenge / Description" value={formData.challengeDescription} onChange={e => setFormData({ ...formData, challengeDescription: e.target.value })} />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="showOnHome" checked={formData.showOnHome} onChange={e => setFormData({ ...formData, showOnHome: e.target.checked })} className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black" />
              <label htmlFor="showOnHome" className="text-sm font-semibold text-zinc-700">Show on Home Page</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="visibility" checked={formData.visibility} onChange={e => setFormData({ ...formData, visibility: e.target.checked })} className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black" />
              <label htmlFor="visibility" className="text-sm font-semibold text-zinc-700">Public Visibility</label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-zinc-700">Images (Max 4)</label>
              <span className="text-xs text-zinc-500">{formData.images.length}/4 images</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images.map((img, idx) => (
                <ImageUpload
                  key={idx}
                  currentImage={img}
                  onUploadSuccess={() => {}}
                  onRemove={() => removeImage(idx)}
                  uploadFolder="projects"
                />
              ))}
              {formData.images.length < 4 && (
                <ImageUpload
                  multiple
                  maxFiles={4 - formData.images.length}
                  onUploadSuccess={handleImageUpload}
                  onUploadMultipleSuccess={handleImageUploadMultiple}
                  uploadFolder="projects"
                />
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
