function FormValidationErrMsg({ errors }) {
  if (!errors) {
    return null;
  }

  return (
    <p className="form-validation-err-msg" role="alert">
      {errors.message}
    </p>
  );
}

export default FormValidationErrMsg;
