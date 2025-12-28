export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-neutral-50 to-amber-100 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-24 w-72 h-72 bg-amber-300/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-80 h-80 bg-amber-200/50 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/5 border border-amber-900/10 text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-800">
            ACCOUNT
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          </span>
          <h1 className="mt-4 text-2xl md:text-3xl font-semibold text-amber-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-600 max-w-sm mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="backdrop-blur-md bg-white/80 border border-neutral-200/70 shadow-xl shadow-amber-900/5 rounded-2xl px-5 py-6 sm:px-6 sm:py-7">
          {children}
        </div>
      </div>
    </div>
  );
}
