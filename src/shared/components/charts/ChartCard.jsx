export const ChartCard = ({ title, children }) => (
  <section className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
    <h3 className="mb-2 text-base font-semibold text-slate-100">{title}</h3>
    {children}
  </section>
)
