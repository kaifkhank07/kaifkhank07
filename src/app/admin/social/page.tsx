"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Admin/Table";
import { Button } from "@/components/Admin/Button";
import { Input } from "@/components/Admin/Input";
import Modal from "@/components/Admin/Modal";
import ConfirmDialog from "@/components/Admin/ConfirmDialog";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function SocialAdmin() {
  const [socials, setSocials] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    platform: "",
    username: "",
    link: "",
  });

  const fetchSocials = async () => {
    try {
      const res = await fetch("/api/socials");
      const data = await res.json();
      if (data.success) setSocials(data.data);
    } catch (err) {
      toast.error("Failed to load socials");
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        platform: item.platform || "",
        username: item.username || "",
        link: item.link || "",
      });
    } else {
      setEditingId(null);
      setFormData({ platform: "", username: "", link: "" });
    }
    setIsModalOpen(true);
  };

  const triggerDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/socials?id=${confirmDialog.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Link deleted");
        fetchSocials();
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

    const url = editingId ? `/api/socials?id=${editingId}` : "/api/socials";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Link ${editingId ? "updated" : "created"}`);
        setIsModalOpen(false);
        fetchSocials();
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
        <Button onClick={() => handleOpenModal()}><Plus size={18} /> Add Link</Button>
      </div>

      <Table>
        <TableHead>
          <TableHeader>Platform</TableHeader>
          <TableHeader>Username</TableHeader>
          <TableHeader>Link</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableHead>
        <TableBody>
          {socials.map((s) => (
            <TableRow key={s._id}>
              <TableCell className="font-semibold">{s.platform}</TableCell>
              <TableCell>{s.username}</TableCell>
              <TableCell className="max-w-xs truncate text-blue-500"><a href={s.link} target="_blank" rel="noreferrer">{s.link}</a></TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={18} /></button>
                  <button onClick={() => triggerDelete(s._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {socials.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-zinc-500">No social links found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Link" : "New Link"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Platform (e.g. GitHub)" value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })} required />
          <Input label="Username (e.g. @kaif)" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
          <Input label="URL Link" type="url" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} required />
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Save Link</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen} 
        title="Delete Social Link" 
        message="Are you sure you want to delete this link? This action cannot be undone." 
        onConfirm={executeDelete} 
        onCancel={() => setConfirmDialog({ isOpen: false, id: "" })} 
        isLoading={isDeleting} 
      />
    </div>
  );
}
