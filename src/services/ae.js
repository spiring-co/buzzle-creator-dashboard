const extractStructureFromFile = async (fileUrl) => {
  const data = { fileUrl };

  const response = await fetch(`${process.env.REACT_APP_AE_SERVICE_URL}/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Could not extract data from file.");
  }
};

const fetchFontInstallbleStatus = async (fontName) => {
  const response = await fetch(
    `http://localhost:4488/getFontInstallableStatus?fontName=${fontName}`
  );
  const result = await response.json();

  return result;
};
export { extractStructureFromFile, fetchFontInstallbleStatus };
