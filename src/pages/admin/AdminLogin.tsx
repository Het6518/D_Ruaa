import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { authApi } from "../../utils/api";
import { usePageMeta } from "../../utils/usePageMeta";

export function AdminLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@fragrancesbydruaa.com");
  const [password, setPassword] = useState("AdminPassword123!");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  usePageMeta(
    mode === "login" ? "Admin Sign In | Fragrances by D'Ruaa" : "Register Admin | Fragrances by D'Ruaa",
    "Secure administrative portal access."
  );

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      if (mode === "register") {
        if (!name) {
          setError("Please enter your full name.");
          setSubmitting(false);
          return;
        }
        await register(name, email, password, "ADMIN");
        setSuccess("Admin account created and logged in!");
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || `${mode === "login" ? "Login" : "Registration"} failed. Please check details.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSetup = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await authApi.setupDefaultAdmin();
      setSuccess(res.message || "Default admin initialized in database!");
      setEmail("admin@fragrancesbydruaa.com");
      setPassword("AdminPassword123!");
    } catch (err: any) {
      setError(err.message || "Setup failed. Check database connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex flex-col items-center group">
          <img
            src="/logo.jpeg"
            alt="Fragrances by D'Ruaa"
            className="w-16 h-16 object-contain rounded-full border border-border shadow-sm group-hover:scale-105 transition-transform"
          />
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-charcoal">
            Fragrances by D'Ruaa
          </h1>
          <p className="text-xs uppercase tracking-[0.22em] text-clay mt-1 font-semibold">
            Admin Management Portal
          </p>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-cream/60 border border-border py-8 px-6 sm:px-10 shadow-soft">
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 pb-3 text-sm font-semibold uppercase tracking-wider transition border-b-2 ${
                mode === "login"
                  ? "border-clay text-clay"
                  : "border-transparent text-muted hover:text-charcoal"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`flex-1 pb-3 text-sm font-semibold uppercase tracking-wider transition border-b-2 ${
                mode === "register"
                  ? "border-clay text-clay"
                  : "border-transparent text-muted hover:text-charcoal"
              }`}
            >
              Register Admin
            </button>
          </div>

          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-charcoal">
              {mode === "login" ? "Welcome Back" : "Create Admin Account"}
            </h2>
            <p className="text-xs text-muted mt-1">
              {mode === "login"
                ? "Enter your administrative credentials to manage products."
                : "Register a new authorized administrator for the catalogue."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 border border-clay/30 bg-clay/10 text-charcoal rounded-md flex items-start gap-3">
              <AlertCircle size={18} className="text-clay shrink-0 mt-0.5" />
              <div className="text-xs leading-5">
                <span className="font-semibold text-clay">Authentication Error: </span>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 border border-emerald-300 bg-emerald-50 text-emerald-900 rounded-md flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-5">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-charcoal mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="D_Ruaa Administrator"
                    className="w-full bg-ivory border border-border pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-muted/60 focus:border-clay focus:ring-1 focus:ring-clay outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-charcoal mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fragrancesbydruaa.com"
                  className="w-full bg-ivory border border-border pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-muted/60 focus:border-clay focus:ring-1 focus:ring-clay outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-ivory border border-border pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-muted/60 focus:border-clay focus:ring-1 focus:ring-clay outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 bg-charcoal text-ivory hover:bg-cocoa py-3 px-4 text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-xs"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-ivory border-t-transparent animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In to Dashboard" : "Create & Access Admin Portal"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Setup / Demo Helper */}
          <div className="mt-6 pt-5 border-t border-border/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-clay uppercase tracking-[0.14em]">
                <Sparkles size={14} />
                <span>Default Admin Credentials</span>
              </div>
              <button
                type="button"
                onClick={handleQuickSetup}
                disabled={submitting}
                className="text-[11px] text-clay hover:underline font-semibold"
                title="Initialize default admin user in database"
              >
                Auto-Setup In DB
              </button>
            </div>
            <div className="mt-2 bg-ivory p-3 border border-border text-xs text-muted space-y-1">
              <p>
                <span className="text-charcoal font-medium">Email:</span>{" "}
                <code className="text-cocoa font-mono">admin@fragrancesbydruaa.com</code>
              </p>
              <p>
                <span className="text-charcoal font-medium">Password:</span>{" "}
                <code className="text-cocoa font-mono">AdminPassword123!</code>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted hover:text-clay transition underline-offset-4 hover:underline">
            ← Return to Fragrances by D'Ruaa Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
