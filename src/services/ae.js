import JSZip from "jszip";

const extractStructureFromFile = async (aeExtractURL = process.env.REACT_APP_AE_SERVICE_URL, fileUrl, fileType = 'ae') => {
  let cachedData = localStorage.getItem(fileUrl)
  if (cachedData) {
    console.log("Extracted data from cached file")
    return JSON.parse(cachedData)
  }
  if (fileType === 'ae') {
    const response = await fetch(`${aeExtractURL ? aeExtractURL : process.env.REACT_APP_AE_SERVICE_URL}/`, {//TODO fetch
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    });

    if (response.ok) {
      const { compositions, staticAssets } = await response.json()
      localStorage.setItem(fileUrl, JSON.stringify({ compositions, staticAssets }))
      console.log("Cached data for this file")
      return { compositions, staticAssets }
    } else {
      throw new Error("Could not extract data from file.");
    }
  } else if (fileType === 'remotion') {
    //get zip content read it , read buzzle.config.json 
    //check for buzzleconfig.json in zip, if found proceedd further else set error config.json file required!
    var response = await fetch(process.env.REMOTION_BUNDLER_URL || "https://buzzle-remotion-bundler.herokuapp.com/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    })
    if (!response.ok) {
      throw new Error((await response.json())?.message);
    }
    response = await response.json()
    localStorage.setItem(fileUrl, JSON.stringify({ compositions: response?.compositions, staticAssets: [] }))
    return { compositions: response?.compositions, staticAssets: [], url: response?.url }
  }
};

export { extractStructureFromFile };
