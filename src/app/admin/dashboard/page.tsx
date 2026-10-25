"use client";

import { useEffect, useState } from "react";
import { FolderOpen, MessageSquare, Wrench, Share2 } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    enquiries: 0,
    skills: 0,
    socials: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, enqRes, skillRes, socRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/enquiry"), // wait, there is no GET /api/enquiry yet. I should create it.
          fetch("/api/skills"),
          fetch("/api/socials")
        ]);

        const projects = await projRes.json();
        const enquiries = enqRes.ok ? await enqRes.json() : { data: [] }; // Handle 404/not implemented
        const skills = await skillRes.json();
        const socials = await socRes.json();

        setStats({
          projects: projects.data?.length || 0,
          enquiries: enquiries.data?.length || 0,
          skills: skills.data?.length || 0,
          socials: socials.data?.length || 0,
        });

        if (enquiries.data) {
          setRecentEnquiries(enquiries.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Projects", value: stats.projects, icon: FolderOpen },
    { title: "Total Enquiries", value: stats.enquiries, icon: MessageSquare },
    { title: "Skill Categories", value: stats.skills, icon: Wrench },
    { title: "Social Links", value: stats.socials, icon: Share2 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-zinc-100 rounded-lg">
                <Icon size={24} className="text-black" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm font-semibold">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200">
          <h2 className="text-xl font-bold">Recent Enquiries</h2>
        </div>
        {recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 text-zinc-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {recentEnquiries.map((enq: any) => (
                  <tr key={enq._id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4">{enq.name}</td>
                    <td className="px-6 py-4">{enq.email}</td>
                    <td className="px-6 py-4">{new Date(enq.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500">
            No recent enquiries.
          </div>
        )}
      </div>
    </div>
  );
}
