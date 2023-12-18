import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Field from "../Field";
import TResource from "./typeCreate";
import { SubmissionError, TError } from "../../utils/types";
import PictureField from "../PictureField";

interface FormProps {
  onSubmit: (item: Partial<TResource>) => any;
  initialValues?: Partial<TResource>;
  error?: TError;
  reset: () => void;
}

const Form = ({ onSubmit, error, reset, initialValues }: FormProps) => {  
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<TResource>({
    defaultValues: initialValues
      ? {
          ...initialValues
        }
      : undefined,
  });

  useEffect(() => {
    if (error instanceof SubmissionError) {
      Object.keys(error.errors).forEach((errorPath) => {
        if (errors[errorPath as keyof TResource]) {
          return;
        }
        setError(errorPath as keyof TResource, {
          type: "server",
          message: error.errors[errorPath],
        });
      });

      reset();
    }
  }, [error, errors, reset, setError]);

  const onFormSubmit: SubmitHandler<TResource> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Field
        register={register}
        name="title"
        label="Title"
        placeholder=""
        type="text"
        required  
        errors={errors}
      />
      <Field
        register={register}
        name="description"
        label="Description"
        placeholder=""
        type="text"
        required
        errors={errors}
      />
      <PictureField 
        register={register}
        name="picture"
        label="Picture"
        errors={errors}
        getValues={getValues}
        setValue={setValue}
      />
      <Field
        register={register}
        name="startingPrice"
        label="Starting price"
        placeholder=""
        type="number"
        required
        errors={errors}
      />
      <Field
        register={register}
        name="closingTime"
        label="Closing time"
        placeholder=""
        type="dateTime"
        required
        errors={errors}
      />
      <Field
        register={register}
        name="auctionStatus"
        label="Status"
        placeholder=""
        type="string"
        required
        errors={errors}
      />
      {errors['@id'] && (
        <div className="form-group">
          <span className="is-invalid"></span>
          <div className="invalid-feedback">{errors['@id']?.message}</div>
        </div>
      )}
      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
};

export default Form;
