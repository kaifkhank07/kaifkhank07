"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Admin/Table";
import { Button } from "@/components/Admin/Button";
import { Input, Textarea } from "@/components/Admin/Input";
import Modal from "@/components/Admin/Modal";
import ConfirmDialog from "@/components/Admin/ConfirmDialog";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: "", type: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    items: "",
  });

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      if (data.success) setSkills(data.data);
    } catch (err) {
      toast.error("Failed to load skills");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/skill-categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    try {
      const res = await fetch("/api/skill-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Category added");
        setNewCategoryName("");
        fetchCategories();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Error adding category");
    } finally {
      setIsAddingCategory(false);
    }
  };

  const triggerDeleteCategory = (id: string) => {
    setConfirmDialog({ isOpen: true, id, type: "category" });
  };

  const executeDeleteCategory = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/skill-categories/${confirmDialog.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
      setConfirmDialog({ isOpen: false, id: "", type: "" });
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        category: item.category || "",
        items: item.items.join(", ") || "",
      });
    } else {
      setEditingId(null);
      setFormData({ category: categories.length > 0 ? categories[0].name : "", items: "" });
    }
    setIsModalOpen(true);
  };

  const triggerDeleteSkillGroup = (id: string) => {
    setConfirmDialog({ isOpen: true, id, type: "skill" });
  };

  const executeDeleteSkillGroup = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/skills?id=${confirmDialog.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Skill group deleted");
        fetchSkills();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setConfirmDialog({ isOpen: false, id: "", type: "" });
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.type === "category") executeDeleteCategory();
    else if (confirmDialog.type === "skill") executeDeleteSkillGroup();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      category: formData.category,
      items: formData.items.split(",").map(i => i.trim()).filter(Boolean)
    };

    const url = editingId ? `/api/skills?id=${editingId}` : "/api/skills";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Skill group ${editingId ? "updated" : "created"}`);
        setIsModalOpen(false);
        fetchSkills();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Category Management */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-800 mb-4">Manage Categories</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4 mb-6 max-w-md items-end">
          <Input 
            label="Category Name"
            value={newCategoryName} 
            onChange={e => setNewCategoryName(e.target.value)} 
            placeholder="New Category Name" 
            required 
          />
          <Button type="submit" isLoading={isAddingCategory}>Add</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <div key={c._id} className="flex items-center gap-2 bg-zinc-100 text-sm px-3 py-1.5 rounded-md border border-zinc-200">
              <span className="font-medium text-zinc-700">{c.name}</span>
              <button type="button" onClick={() => triggerDeleteCategory(c._id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
          {categories.length === 0 && <span className="text-zinc-500 text-sm">No categories added yet.</span>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-zinc-800">Skill Groups</h2>
          <Button onClick={() => handleOpenModal()}><Plus size={18} /> Add Skill Group</Button>
        </div>

        <Table>
          <TableHead>
            <TableHeader>Category</TableHeader>
            <TableHeader>Items</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableHead>
          <TableBody>
            {skills.map((s) => (
              <TableRow key={s._id}>
                <TableCell className="font-semibold">{s.category}</TableCell>
                <TableCell className="max-w-md truncate">{s.items.join(", ")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={18} /></button>
                    <button onClick={() => triggerDeleteSkillGroup(s._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {skills.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-zinc-500">No skills found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Skill Group" : "New Skill Group"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Category</label>
            <select 
              className="w-full p-2 border border-zinc-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <Textarea label="Items (comma separated)" value={formData.items} onChange={e => setFormData({ ...formData, items: e.target.value })} required />
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Save Skill Group</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen} 
        title={confirmDialog.type === "category" ? "Delete Category" : "Delete Skill Group"} 
        message={`Are you sure you want to delete this ${confirmDialog.type === "category" ? "category" : "skill group"}? This action cannot be undone.`} 
        onConfirm={handleConfirmDelete} 
        onCancel={() => setConfirmDialog({ isOpen: false, id: "", type: "" })} 
        isLoading={isDeleting} 
      />
    </div>
  );
}
