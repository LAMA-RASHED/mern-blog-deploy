import { Field } from 'formik';
import { FormikErrors, FormikTouched } from 'formik';

interface IInputComponentProps<T> {
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  name: keyof T; // The name corresponds to a key in the form values
  label: string;
  inputType?: string;
  placeholder?: string;
}

const InputComponent = <T extends object>({
  errors,
  touched,
  label,
  name,
  inputType = 'text',
  placeholder,
}: IInputComponentProps<T>) => {
  return (
    <div>
      <label htmlFor={name as string} className="form-label">
        {label}:
      </label>
      <Field
        type={inputType}
        name={name as string}
        id={name as string}
        className="form-control"
        placeholder={placeholder}
      />
      {errors[name] && touched[name] && (
        <p className="mt-1 text-red-500 text-xs">{errors[name] as string}</p>
      )}
    </div>
  );
};

export default InputComponent;
