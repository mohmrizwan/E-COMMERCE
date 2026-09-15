import PropTypes from "prop-types";

const FormField = ({ label, name, register, rules, error, ...inputProps }) => (
  <div className="grid gap-2">
    <label htmlFor={name} className="text-xs font-bold text-slate-700">{label}</label>
    <input
      id={name}
      className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-[#17112B] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 aria-[invalid=true]:border-red-600"
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      {...register(name, rules)}
      {...inputProps}
    />
    {error && (
      <span id={`${name}-error`} className="text-xs text-red-700" role="alert">
        {error.message}
      </span>
    )}
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object,
  error: PropTypes.shape({ message: PropTypes.string }),
};

export default FormField;