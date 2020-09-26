module.exports = {
  compress: (output = "encoded.mp4", preset = "mp4") => ({
    module: "@nexrender/action-encode",
    preset,
    output,
  }),

  addWaterMark: (
    input = "encoded.mp4",
    output = "watermarked.mp4",
    watermark
  ) => ({
    module: "action-watermark",
    input,
    watermark,
    output,
  }),
  mergeVideos: (
    input = "watermarked.mp4",
    input2 = "watermarked.mp4",
    output = "merged.mp4"
  ) => {
    const f1 = input.substr(input.lastIndexOf("."));
    const f2 = input2.substr(input2.lastIndexOf("."));

    return {
      //make changes
      module: "action-mergeVideos",
      input,
      f1,
      input2,
      f2,
      output,
    };
  },
  addAudio: (inputV, inputA, output = "audioVideo.mp4") => ({
    module: "action-addAudio",
    inputV,
    inputA,
    output,
  }),
  upload: (input = "encoded.mp4", output = `${Date.now()}.mp4`) => ({
    module: "@nexrender/action-upload",
    input,
    provider: "s3",
    params: {
      region: "us-east-1",
      bucket: "bulaava-assets",
      key: `outputs/${output}`,
      //TODO better acl policy
      acl: "public-read",
    },
  }),
};
