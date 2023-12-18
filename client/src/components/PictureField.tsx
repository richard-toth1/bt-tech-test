import { ChangeEvent, useState } from "react";
import {
    DeepMap,
    DeepPartial,
    FieldError,
    FieldValues,
    Path,
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
  } from "react-hook-form";
import { useFetch } from "../hooks";
  
  type FileEvent = ChangeEvent<HTMLInputElement> & {
    target: EventTarget & { files: FileList };
  };

  interface PictureFieldProps<TFieldValues extends FieldValues> {
    register: UseFormRegister<TFieldValues>;
    name: Path<TFieldValues>;
    errors: DeepMap<DeepPartial<TFieldValues>, FieldError>;
    getValues: UseFormGetValues<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
    label?: string;
  }
  
  const PictureField = <TFieldValues extends FieldValues>({
    register,
    name,
    errors,
    getValues,
    setValue,
    label
  }: PictureFieldProps<TFieldValues>) => {
    const { fetch } = useFetch();
    const idPath = name + ".@id" as Path<TFieldValues>;
    const contentUrlPath = name + ".contentUrl" as Path<TFieldValues>;
    const [contentUrl, setContentUrl] = useState(() => {
      return getValues(contentUrlPath);
    });
    const inputProps: { className: string; "aria-invalid"?: boolean } = {
      className: "form-control",
    };
    
    if (errors[name]) {
      inputProps.className += " is-invalid";
      inputProps["aria-invalid"] = true;
    }
    
    if (!errors[name]) {
      inputProps.className += " is-valid";
    }
    
    
    const handleUpload = async (event: FileEvent) => {
      const file = event.target.files[0];
      const formData  = new FormData();
      formData.append('file', file);
      const response = await fetch("/media_objects", {
        method: 'POST',
        body: formData
      });

      if (response.response.ok) {
        setValue(idPath, response.json['@id'], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        setContentUrl(response.json['contentUrl']);
      }
    }
  
    return (
      <>
        <div className="form-group">
          <label className="form-control-label" htmlFor={idPath}>
            {label ? label : name}
          </label>
          <br/>
          <img className="auction-picture" src={contentUrl} />
          <input
            id={idPath}
            type="hidden"
            {...inputProps}
            {...register(idPath, {
              required: "Required",
            })}
          />
        </div>
        <div className="form-group">          
          <input
            id='picture_upload'
            type="file"
            {...inputProps}
            onChange={handleUpload}
          />
          {errors[name] && (
            <div className="invalid-feedback">{errors[name]['@id']?.message}</div>
          )}
        </div>
      </>      
    );
  };
  
  export default PictureField;
  