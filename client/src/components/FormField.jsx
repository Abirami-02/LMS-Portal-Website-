function FormField({ label, type = 'text', placeholder, name, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-4 focus:ring-teal/10"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </label>
  )
}

export default FormField
