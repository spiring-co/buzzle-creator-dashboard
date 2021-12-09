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
    var response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error("Could not extract data from file.");
    }
    response = await response.blob()
    var config = await JSZip.loadAsync(response)
    try {
      config = await (config.file('buzzle.config.json').async('text'))
      config = (JSON.parse(config))
      localStorage.setItem(fileUrl, JSON.stringify({ compositions: config?.compositions, staticAssets: [] }))
      return { compositions: config?.compositions, staticAssets: [] }
    } catch (err) {
      config = null
      throw new Error("Could not extract data from file.");
    }

  }
};

export { extractStructureFromFile };
