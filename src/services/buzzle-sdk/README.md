## Usage

```javascript
const { apiClient, progressListener } = require("buzzle-sdk");

const API_URL = "http://localhost:5000";

const pl = progressListener(API_URL);
const { Job } = apiClient({ baseUrl: API_URL });

async function main() {
  try {
    const { id } = await Job.create({
      idVideoTemplate: "FU_Sg-ygG9",
      idVersion: "XJy4MpE0M",
    });

    pl.on(id, (data) => console.log(data));
  } catch (e) {
    console.error(`Error:${e.message}`);
  }
}

main();
```
