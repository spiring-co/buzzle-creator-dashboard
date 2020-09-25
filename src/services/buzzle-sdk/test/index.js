const { apiClient, progressListener } = require("../lib");

const pl = progressListener("http://localhost:5000");
const { Job } = apiClient({ baseUrl: "http://localhost:5000" });

async function main() {
  try {
    const { id } = await Job.create({
      idVideoTemplate: "FU_Sg-ygG9",
      idVersion: "XJy4MpE0M",
    });

    console.log(id);
    pl.on(id, (data) => console.log(data));
  } catch (e) {
    console.error(`Error:${e.message}`);
  }
}

main();
