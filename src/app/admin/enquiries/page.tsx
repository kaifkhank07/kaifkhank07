"use client";

import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Admin/Table";
import { Button } from "@/components/Admin/Button";
import { Input } from "@/components/Admin/Input";
import Modal from "@/components/Admin/Modal";
import ConfirmDialog from "@/components/Admin/ConfirmDialog";
import toast from "react-hot-toast";
import { Trash2, Eye, Download } from "lucide-react";

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/enquiry");
      const data = await res.json();
      if (data.success) setEnquiries(data.data);
    } catch (err) {
      toast.error("Failed to load enquiries");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const triggerDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/enquiry?id=${confirmDialog.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Enquiry deleted");
        fetchEnquiries();
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

  const handleView = (enq: any) => {
    setSelectedEnquiry(enq);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ["Name,Email,Number,Message,Date"];
    const csv = enquiries.map(e => 
      `"${e.name}","${e.email}","${e.number}","${e.message.replace(/"/g, '""')}","${new Date(e.createdAt).toLocaleString()}"`
    );
    const blob = new Blob([[...headers, ...csv].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.number && e.number.includes(searchTerm))
    );
  }, [enquiries, searchTerm]);

  const paginatedEnquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEnquiries.slice(start, start + itemsPerPage);
  }, [filteredEnquiries, currentPage]);

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div className="flex-1 max-w-sm">
          <Input 
            label="Search Enquiries" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <Button onClick={handleExportCSV} variant="secondary">
          <Download size={18} /> Export CSV
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableHeader>Date</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Number</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableHead>
        <TableBody>
          {paginatedEnquiries.map((e) => (
            <TableRow key={e._id}>
              <TableCell className="text-zinc-500 whitespace-nowrap">
                {new Date(e.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-semibold">{e.name}</TableCell>
              <TableCell>{e.email}</TableCell>
              <TableCell>{e.number}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={() => handleView(e)} className="p-2 text-zinc-600 hover:bg-zinc-100 rounded"><Eye size={18} /></button>
                  <button onClick={() => triggerDelete(e._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredEnquiries.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-zinc-500">No enquiries found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button 
            variant="secondary" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 font-semibold text-zinc-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="secondary" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enquiry Details">
        {selectedEnquiry && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-zinc-500 font-semibold mb-1">Date</p>
              <p>{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-zinc-500 font-semibold mb-1">From</p>
              <p className="font-semibold">{selectedEnquiry.name}</p>
              <p className="text-blue-600"><a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a></p>
              <p className="text-zinc-400 mt-1">{selectedEnquiry.number}</p>
            </div>
            <div>
              <p className="text-zinc-500 font-semibold mb-1">Message</p>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen} 
        title="Delete Enquiry" 
        message="Are you sure you want to delete this enquiry? This action cannot be undone." 
        onConfirm={executeDelete} 
        onCancel={() => setConfirmDialog({ isOpen: false, id: "" })} 
        isLoading={isDeleting} 
      />
    </div>
  );
}
