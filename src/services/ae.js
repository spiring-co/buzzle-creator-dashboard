const extractStructureFromFile = async (fileUrl) => {

  const response = await fetch(`${process.env.REACT_APP_AE_SERVICE_URL}/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileUrl })
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Could not extract data from file.");
  }
};

export { extractStructureFromFile };
