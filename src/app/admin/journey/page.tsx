"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Admin/Table";
import { Button } from "@/components/Admin/Button";
import { Input, Textarea } from "@/components/Admin/Input";
import Modal from "@/components/Admin/Modal";
import ConfirmDialog from "@/components/Admin/ConfirmDialog";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function JourneyAdmin() {
  const [journey, setJourney] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    joinedDate: "",
    completedDate: "",
    type: "Experience",
    title: "",
    description: "",
  });

  const fetchJourney = async () => {
    try {
      const res = await fetch("/api/journey");
      const data = await res.json();
      if (data.success) setJourney(data.data);
    } catch (err) {
      toast.error("Failed to load journey data");
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        joinedDate: item.joinedDate || "",
        completedDate: item.completedDate || "",
        type: item.type || "Experience",
        title: item.title || "",
        description: item.description || "",
      });
    } else {
      setEditingId(null);
      setFormData({ joinedDate: "", completedDate: "", type: "Experience", title: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const triggerDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/journey?id=${confirmDialog.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Entry deleted");
        fetchJourney();
      } else {
        toast.error(data.error || "Failed to delete");
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

    const url = editingId ? `/api/journey?id=${editingId}` : "/api/journey";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Entry ${editingId ? "updated" : "created"}`);
        setIsModalOpen(false);
        fetchJourney();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => handleOpenModal()}><Plus size={18} /> Add Entry</Button>
      </div>

      <Table>
        <TableHead>
          <TableHeader>Title</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Joined</TableHeader>
          <TableHeader>Completed</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableHead>
        <TableBody>
          {journey.map((j) => (
            <TableRow key={j._id}>
              <TableCell className="font-semibold">{j.title}</TableCell>
              <TableCell>{j.type}</TableCell>
              <TableCell>{j.joinedDate}</TableCell>
              <TableCell>{j.completedDate || "Present"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(j)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={18} /></button>
                  <button onClick={() => triggerDelete(j._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {journey.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-zinc-500">No entries found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Entry" : "New Entry"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700">Type</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="Experience">Experience</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <Input label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Joined Date (e.g. 2024)" value={formData.joinedDate} onChange={e => setFormData({ ...formData, joinedDate: e.target.value })} required />
            <Input label="Completed Date (leave blank for Present)" value={formData.completedDate} onChange={e => setFormData({ ...formData, completedDate: e.target.value })} />
          </div>
          <Textarea label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Save Entry</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen} 
        title="Delete Journey Entry" 
        message="Are you sure you want to delete this entry? This action cannot be undone." 
        onConfirm={executeDelete} 
        onCancel={() => setConfirmDialog({ isOpen: false, id: "" })} 
        isLoading={isDeleting} 
      />
    </div>
  );
}
