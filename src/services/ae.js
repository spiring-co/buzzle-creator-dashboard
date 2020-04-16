const extractStructureFromFile = async (file) => {
  var data = new FormData();
  data.append("aepFile", file);
  const response = await fetch(
    `${process.env.REACT_APP_AE_SERVICE_URL}/getStructureFromFile`,
    {
      method: "POST",
      body: data,
    }
  );

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(await response.json());
  }
};

export { extractStructureFromFile };
