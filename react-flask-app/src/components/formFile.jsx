import { React, useDebugValue, useEffect, useState } from "react";
function Form({ set }) {
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
      const response = await fetch("/upload_file", {
        method: "POST",
        body: formData,
      }).then((res) => {
        console.log(res);
        set(true);
      });
      // Handle the response from the server
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <form onSubmit={(e) => submitForm(e)}>
      {/* <label for="file">File</label> */}
      <div className="flex flex-col gap-3">
        <input
          id="file"
          type="file"
          onChange={(e) => handleFileChange(e)}
          name="file"
        />
        <button className="w-fit self-center">Subir</button>
      </div>
    </form>
  );
}

export default Form;
