"use client";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-sm uppercase tracking-wider">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <th className="px-6 py-4 font-semibold">{children}</th>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-zinc-200">{children}</tbody>;
}

export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`hover:bg-zinc-50 transition-colors ${className || ''}`} {...props}>{children}</tr>;
}

export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className || ''}`} {...props}>{children}</td>;
}
