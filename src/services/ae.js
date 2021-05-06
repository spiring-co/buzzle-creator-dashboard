const extractStructureFromFile = async (aeExtractURL = process.env.REACT_APP_AE_SERVICE_URL, fileUrl) => {
  let cachedData=localStorage.getItem(fileUrl)
  if(cachedData){
    console.log("Extracted data from cached file")
    return JSON.parse(cachedData)
  }
  const response = await fetch(`${aeExtractURL ? aeExtractURL : process.env.REACT_APP_AE_SERVICE_URL}/`, {//TODO fetch
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileUrl }),
  });

  if (response.ok) {
    const { compositions, staticAssets }=await response.json()
    localStorage.setItem(fileUrl,JSON.stringify({ compositions, staticAssets }))
    console.log("Cached data for this file")
    return { compositions, staticAssets }
  } else {
    throw new Error("Could not extract data from file.");
  }
};

export { extractStructureFromFile };
