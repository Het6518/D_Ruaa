import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, Package, PlusCircle, ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 text-sm font-medium transition px-3 py-2 rounded-md ${
      isActive ? "bg-cream text-clay font-semibold" : "text-charcoal hover:text-clay hover:bg-cream/50"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ivory/95 backdrop-blur shadow-sm">
      <div className="container-px mx-auto flex max-w-7xl items-center justify-between py-3">
        {/* Logo & Admin Badge */}
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-3 group">
            <img
              src="/logo.jpeg"
              alt="Fragrances by D'Ruaa Logo"
              className="w-10 h-10 object-contain rounded-full border border-border/80 shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center font-display font-bold leading-tight tracking-wide text-charcoal">
              <span className="text-xl sm:text-2xl leading-none">Fragrances</span>
              <span className="text-[10px] sm:text-xs tracking-[0.2em] font-normal text-muted mt-0.5">by D'Ruaa</span>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1 bg-linen/80 border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay rounded-full">
            <ShieldCheck size={13} />
            Admin Portal
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/products" className={navClass}>
            <Package size={16} />
            <span>Products</span>
          </NavLink>
          <NavLink to="/admin/products/new" className={navClass}>
            <PlusCircle size={16} />
            <span>Add Product</span>
          </NavLink>
        </nav>

        {/* User profile & Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-charcoal transition border border-border/80 px-3 py-1.5 rounded-full hover:bg-cream/60"
            title="View live customer storefront in new tab"
          >
            <span>Live Store</span>
            <ExternalLink size={13} />
          </Link>

          <div className="flex items-center gap-3 pl-2 border-l border-border">
            <div className="text-right">
              <p className="text-xs font-semibold text-charcoal leading-none">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-muted leading-none mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-muted hover:text-clay hover:bg-cream rounded-full transition"
              title="Log out from admin"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="rounded-full border border-border p-2.5 md:hidden text-charcoal hover:bg-cream"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-border bg-ivory px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <div className="pb-3 mb-2 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-charcoal">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-clay font-medium px-3 py-1 border border-clay/30 rounded-md"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>

            <NavLink to="/admin" end className={navClass} onClick={() => setOpen(false)}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/products" className={navClass} onClick={() => setOpen(false)}>
              <Package size={18} />
              <span>Products Management</span>
            </NavLink>
            <NavLink to="/admin/products/new" className={navClass} onClick={() => setOpen(false)}>
              <PlusCircle size={18} />
              <span>Add New Product</span>
            </NavLink>
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 text-sm font-medium text-muted px-3 py-2 mt-2 border-t border-border"
              onClick={() => setOpen(false)}
            >
              <ExternalLink size={16} />
              <span>View Customer Storefront</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
