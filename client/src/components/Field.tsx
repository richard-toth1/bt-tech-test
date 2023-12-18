import {
  DeepMap,
  DeepPartial,
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface FieldProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  name: Path<TFieldValues>;
  placeholder: string;
  type: string;
  step?: string;
  required?: boolean;
  errors: DeepMap<DeepPartial<TFieldValues>, FieldError>;
  label?: string; 
}

const Field = <TFieldValues extends FieldValues>({
  register,
  name,
  placeholder,
  type,
  step,
  required = false,
  errors,
  label,
}: FieldProps<TFieldValues>) => {
  const inputProps: { className: string; "aria-invalid"?: boolean, min?:string } = {
    className: "form-control",
  };

  if (errors[name]) {
    inputProps.className += " is-invalid";
    inputProps["aria-invalid"] = true;
  }

  if (!errors[name]) {
    inputProps.className += " is-valid";
  }

  return (
    <div className="form-group">
      { type !== 'hidden' && <label className="form-control-label" htmlFor={name}>
        {label ? label : name}
      </label> }
      <input
        id={name}
        placeholder={placeholder}
        type={type === 'dateTime' ? 'datetime-local' : type}
        step={step}
        {...inputProps}
        {...register(name, {
          required: "Required",
          valueAsNumber: type === "number",
        })}
      />
      {errors[name] && (
        <div className="invalid-feedback">{errors[name]?.message}</div>
      )}
    </div>
  );
};

export default Field;
