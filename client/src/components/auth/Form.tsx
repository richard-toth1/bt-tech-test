import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Field from "../Field";
import { SubmissionError, TError } from "../../utils/types";
import { Login } from "../../interfaces/Auth";

interface FormProps {
  onSubmit: (item: Partial<Login>) => any;
  initialValues?: Partial<Login>;
  error?: TError;
  reset: () => void;
}

const Form = ({ onSubmit, error, reset, initialValues }: FormProps) => {  
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    defaultValues: initialValues
      ? {
          ...initialValues
        }
      : undefined,
  });

  useEffect(() => {
    if (error instanceof SubmissionError) {
      Object.keys(error.errors).forEach((errorPath) => {
        if (errors[errorPath as keyof Login]) {
          return;
        }
        setError(errorPath as keyof Login, {
          type: "server",
          message: error.errors[errorPath],
        });
      });

      reset();
    }
  }, [error, errors, reset, setError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        register={register}
        name="username"
        placeholder=""
        type="text"
        required  
        errors={errors}
      />
      <Field
        register={register}
        name="password"
        placeholder=""
        type="password"
        required
        errors={errors}
      />  

      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
};

export default Form;
