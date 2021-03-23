const extractStructureFromFile = async (aeExtractURL = process.env.REACT_APP_AE_SERVICE_URL, fileUrl) => {
  const response = await fetch(`${aeExtractURL ? aeExtractURL : process.env.REACT_APP_AE_SERVICE_URL}/`, {//TODO fetch
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileUrl }),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Could not extract data from file.");
  }
};

export { extractStructureFromFile };
