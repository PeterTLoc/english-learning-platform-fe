import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-slate-400 mb-4" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={item.label} className="flex items-center">
          {item.href ? (
            <Link href={item.href} className="hover:text-[#4CC2FF] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-200 font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && (
            <svg className="mx-2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          )}
        </span>
      ))}
    </nav>
  );
} 