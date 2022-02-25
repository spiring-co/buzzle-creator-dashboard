export const copyToClipboard = async (text: string) => {
    //@ts-ignore
    const result = await navigator.permissions.query({ name: "clipboard-write" })
    if (result.state == "granted" || result.state == "prompt") {
        return navigator.clipboard.writeText(`${text}`).then(function () {
            return Promise.resolve()
        }, function (reason) {
            return Promise.reject("Copying not supported in your browser!")
        });
    }
}


export const getLayersFromComposition = (c: any, type?: "textLayers" | "imageLayers",
    templateType?: "ae" | "remotion"): any => {
    templateType = templateType || "ae"
    if (!c) return [];
    // if type is null
    if (templateType === 'remotion') {
        if (!type) {
            return {
                textLayers: getLayersFromComposition(c, "textLayers", templateType),
                imageLayers: getLayersFromComposition(c, "imageLayers", templateType),
            };
        }
        return c['fields']
    }
    if (!type) {
        return {
            textLayers: getLayersFromComposition(c, "textLayers", templateType),
            imageLayers: getLayersFromComposition(c, "imageLayers", templateType),
        };
    }
    if (c[type]) {
        return c[type].concat(
            ...Object.values(c.comps || {}).map((c) =>
                getLayersFromComposition(c, type, templateType)
            )
        );
    } else return []
}

export const getUniqueId = () => Math.random().toString(36).substr(2, 9);

export const extractStructureFromFile = async (extractionURL: string, fileUrl: string, fileType: 'ae' | "remotion") => {
    let cachedData = localStorage.getItem(fileUrl + "")
    if (cachedData) {
        console.log("Extracted data from cached file")
        return JSON.parse(cachedData)
    }
    if (fileType === 'ae') {
        const response = await fetch(`${extractionURL ? `http://${extractionURL}` : process.env.REACT_APP_AE_SERVICE_URL}/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileUrl }),
        });
        if (response.ok) {
            const { compositions, staticAssets } = await response.json()
            // localStorage.setItem(fileUrl+"", JSON.stringify({ compositions, staticAssets }))
            console.log("Cached data for this file")
            return { compositions, staticAssets }
        } else {
            throw new Error("Could not extract data from file.");
        }
    } else if (fileType === 'remotion') {
        //get zip content read it , read buzzle.config.json 
        //check for buzzleconfig.json in zip, if found proceedd further else set error config.json file required!
        var response = await fetch(extractionURL, {
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
        // localStorage.setItem(fileUrl+"", JSON.stringify({ compositions: response?.compositions, staticAssets: [] }))
        return { compositions: (response as any)?.compositions, staticAssets: [], url: response?.url }
    }
};

