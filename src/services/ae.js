const extractStructureFromFile = async (file) => {
  const data = new FormData();
  data.append("file", file);

  const response = await fetch(`${process.env.REACT_APP_AE_SERVICE_URL}/`, {
    method: "POST",
    body: data,
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
