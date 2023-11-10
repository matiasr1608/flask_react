import { React, useDebugValue, useEffect, useState } from "react";
function Form() {
  const [fileSaved, setFileSaved] = useState(null);

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFileSaved(e.target.files[0]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", fileSaved);
    console.log(formData);
    try {
      const response = await fetch("/subir_archivo", {
        method: "POST",
        body: formData,
      }).then((res) => {
        console.log(res);
      });
      // Handle the response from the server
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <form onSubmit={(e) => submitForm(e)}>
      {/* <label for="file">File</label> */}
      <input
        id="file"
        type="file"
        onChange={(e) => handleFileChange(e)}
        name="file"
      />
      <button>Upload</button>
    </form>
  );
}

export default Form;
