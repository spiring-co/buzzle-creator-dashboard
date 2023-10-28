import AWS, { S3 } from "aws-sdk";

const bucketName = "buzzle-new";
const bucketRegion = "us-east-1";
const tagsByUseCase = {
  archive: "true",
  deleteAfter7Days: "1 week",
  deleteAfter90Days: "90 Days",
};

// AWS.config.update({
//   region: bucketRegion,
// });

// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: "us-east-1:06431ed0-60d3-457c-9c6c-7866955fc5e5",
// });
// Create EC2 service object
var ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

/**
 * @param  {String} Key Path of the file
 * @param  {} Body File body
 */
const s3Client = new S3({
  endpoint: "https://sgp1.digitaloceanspaces.com",
  region: bucketRegion,
  credentials: {
    accessKeyId: "DO00J4FL4AG2Z83NAJR4",
    secretAccessKey: "T/Nl0T4WZ/li6RsVlT/cc4k+S5TLAIZvbesp+Ko0Vjs"
  }
});

export const upload = (Key: string, Body: any, tag?: "archive" | "deleteAfter7Days" | "deleteAfter90Days") => {

  var upload = s3Client.upload({
    Bucket: bucketName,
    Key: Key,
    Body,
    ACL: 'public-read',
  },
    {
      tags: [{ Key: (tag || "archive"), Value: tagsByUseCase[tag || "archive"] }]
    });
  return upload;

  /*
  HOW TO USE?

  FOR PROGRESS -> 
  upload.on("httpUploadProgress", ({loaded, total}) => console.log(loaded/total));

  FOR async/await ->
  await upload.promise();
  
  */
};

export const getInstanceInfo = async () => {
  const response = await ec2.describeInstances().promise();
  console.log(response);
  return response;
};


