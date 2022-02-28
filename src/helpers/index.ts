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

export const extractedDataSample = {
    "compositions": {
        "branding": {
            "textLayers": [],
            "imageLayers": [
                {
                    "index": 3,
                    "name": "bulavva logo_1.png",
                    "height": 626,
                    "width": 490,
                    "extension": "png"
                }
            ],
            "comps": {}
        },
        "Car animation": {
            "textLayers": [],
            "imageLayers": [
                {
                    "index": 3,
                    "name": "BG_1",
                    "height": 1920,
                    "width": 1080,
                    "extension": "null"
                }
            ],
            "comps": {
                "91": {
                    "textLayers": [],
                    "imageLayers": [
                        {
                            "index": 5,
                            "name": "BG_2",
                            "height": 1920,
                            "width": 1080,
                            "extension": "null"
                        }
                    ],
                    "comps": {
                        "1": {
                            "textLayers": [],
                            "imageLayers": [
                                {
                                    "index": 3,
                                    "name": "bulavva logo_1.png",
                                    "height": 626,
                                    "width": 490,
                                    "extension": "png"
                                }
                            ],
                            "comps": {}
                        },
                        "188": {
                            "textLayers": [
                                {
                                    "index": 1,
                                    "name": "SAVE THE DATE",
                                    "text": "SAVE THE DATE",
                                    "font": "Hey-October"
                                },
                                {
                                    "index": 2,
                                    "name": "20/07/2020",
                                    "text": "20/07/2020",
                                    "font": "Hey-October"
                                }
                            ],
                            "imageLayers": [],
                            "comps": {}
                        },
                        "658": {
                            "textLayers": [],
                            "imageLayers": [],
                            "comps": {}
                        },
                        "1187": {
                            "textLayers": [],
                            "imageLayers": [
                                {
                                    "index": 3,
                                    "name": "bulavva logo_1.png",
                                    "height": 626,
                                    "width": 490,
                                    "extension": "png"
                                }
                            ],
                            "comps": {}
                        }
                    }
                },
                "466": {
                    "textLayers": [],
                    "imageLayers": [
                        {
                            "index": 1,
                            "name": "still road.png",
                            "height": 1920,
                            "width": 1080,
                            "extension": "png"
                        }
                    ],
                    "comps": {}
                }
            }
        },
        "Car_Ride": {
            "textLayers": [],
            "imageLayers": [
                {
                    "index": 5,
                    "name": "BG_2",
                    "height": 1920,
                    "width": 1080,
                    "extension": "null"
                }
            ],
            "comps": {
                "1": {
                    "textLayers": [],
                    "imageLayers": [
                        {
                            "index": 3,
                            "name": "bulavva logo_1.png",
                            "height": 626,
                            "width": 490,
                            "extension": "png"
                        }
                    ],
                    "comps": {}
                },
                "188": {
                    "textLayers": [
                        {
                            "index": 1,
                            "name": "SAVE THE DATE",
                            "text": "SAVE THE DATE",
                            "font": "Hey-October"
                        },
                        {
                            "index": 2,
                            "name": "20/07/2020",
                            "text": "20/07/2020",
                            "font": "Hey-October"
                        }
                    ],
                    "imageLayers": [],
                    "comps": {}
                },
                "658": {
                    "textLayers": [],
                    "imageLayers": [],
                    "comps": {}
                },
                "1187": {
                    "textLayers": [],
                    "imageLayers": [
                        {
                            "index": 3,
                            "name": "bulavva logo_1.png",
                            "height": 626,
                            "width": 490,
                            "extension": "png"
                        }
                    ],
                    "comps": {}
                }
            }
        },
        "Final_ride": {
            "textLayers": [],
            "imageLayers": [
                {
                    "index": 1,
                    "name": "Black Solid 3",
                    "height": 1920,
                    "width": 1080,
                    "extension": "null"
                },
                {
                    "index": 2,
                    "name": "Black Solid 2",
                    "height": 1920,
                    "width": 1080,
                    "extension": "null"
                }
            ],
            "comps": {
                "2": {
                    "textLayers": [],
                    "imageLayers": [
                        {
                            "index": 3,
                            "name": "BG_1",
                            "height": 1920,
                            "width": 1080,
                            "extension": "null"
                        }
                    ],
                    "comps": {
                        "91": {
                            "textLayers": [],
                            "imageLayers": [
                                {
                                    "index": 5,
                                    "name": "BG_2",
                                    "height": 1920,
                                    "width": 1080,
                                    "extension": "null"
                                }
                            ],
                            "comps": {
                                "1": {
                                    "textLayers": [],
                                    "imageLayers": [
                                        {
                                            "index": 3,
                                            "name": "bulavva logo_1.png",
                                            "height": 626,
                                            "width": 490,
                                            "extension": "png"
                                        }
                                    ],
                                    "comps": {}
                                },
                                "188": {
                                    "textLayers": [
                                        {
                                            "index": 1,
                                            "name": "SAVE THE DATE",
                                            "text": "SAVE THE DATE",
                                            "font": "Hey-October"
                                        },
                                        {
                                            "index": 2,
                                            "name": "20/07/2020",
                                            "text": "20/07/2020",
                                            "font": "Hey-October"
                                        }
                                    ],
                                    "imageLayers": [],
                                    "comps": {}
                                },
                                "658": {
                                    "textLayers": [],
                                    "imageLayers": [],
                                    "comps": {}
                                },
                                "1187": {
                                    "textLayers": [],
                                    "imageLayers": [
                                        {
                                            "index": 3,
                                            "name": "bulavva logo_1.png",
                                            "height": 626,
                                            "width": 490,
                                            "extension": "png"
                                        }
                                    ],
                                    "comps": {}
                                }
                            }
                        },
                        "466": {
                            "textLayers": [],
                            "imageLayers": [
                                {
                                    "index": 1,
                                    "name": "still road.png",
                                    "height": 1920,
                                    "width": 1080,
                                    "extension": "png"
                                }
                            ],
                            "comps": {}
                        }
                    }
                },
                "726": {
                    "textLayers": [],
                    "imageLayers": [],
                    "comps": {}
                },
                "760": {
                    "textLayers": [],
                    "imageLayers": [],
                    "comps": {}
                },
                "791": {
                    "textLayers": [
                        {
                            "index": 1,
                            "name": "Naveen",
                            "text": "Naveen",
                            "font": "Hey-October"
                        },
                        {
                            "index": 2,
                            "name": "Weds",
                            "text": "Weds",
                            "font": "Hey-October"
                        },
                        {
                            "index": 3,
                            "name": "Priyanka",
                            "text": "Priyanka",
                            "font": "Hey-October"
                        }
                    ],
                    "imageLayers": [],
                    "comps": {}
                }
            }
        },
        "save the date": {
            "textLayers": [
                {
                    "index": 1,
                    "name": "SAVE THE DATE",
                    "text": "SAVE THE DATE",
                    "font": "Hey-October"
                },
                {
                    "index": 2,
                    "name": "20/07/2020",
                    "text": "20/07/2020",
                    "font": "Hey-October"
                }
            ],
            "imageLayers": [],
            "comps": {}
        },
        "Still bg": {
            "textLayers": [],
            "imageLayers": [
                {
                    "index": 1,
                    "name": "still road.png",
                    "height": 1920,
                    "width": 1080,
                    "extension": "png"
                }
            ],
            "comps": {}
        },
        "pattern": {
            "textLayers": [],
            "imageLayers": [],
            "comps": {}
        },
        "Streaks": {
            "textLayers": [],
            "imageLayers": [],
            "comps": {}
        },
        "Car Interior": {
            "textLayers": [],
            "imageLayers": [],
            "comps": {}
        },
        "Name text": {
            "textLayers": [
                {
                    "index": 1,
                    "name": "Naveen",
                    "text": "Naveen",
                    "font": "Hey-October"
                },
                {
                    "index": 2,
                    "name": "Weds",
                    "text": "Weds",
                    "font": "Hey-October"
                },
                {
                    "index": 3,
                    "name": "Priyanka",
                    "text": "Priyanka",
                    "font": "Hey-October"
                }
            ],
            "imageLayers": [],
            "comps": {}
        },
        "branding 2": {
            "textLayers": [],
            "imageLayers": [
                {
                    "index": 3,
                    "name": "bulavva logo_1.png",
                    "height": 626,
                    "width": 490,
                    "extension": "png"
                }
            ],
            "comps": {}
        }
    },
    "staticAssets": [
        "Tiles.m4v",
        "Culture Code - Make Me Move (feat. Karra) [NCS Release].mp3",
        "Car-1.m4v",
        "Car Racing.mp3",
        "still road.png",
        "bulavva logo_1.png"
    ]
}