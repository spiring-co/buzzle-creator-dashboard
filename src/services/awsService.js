import AWS from "aws-sdk";

const bucketName = "spiring-creator";
const bucketRegion = "us-east-1";
const tagsByUseCase = {
  archive: "true",
  deleteAfter7Days: "1 week",
  deleteAfter90Days: "90 Days",
};

AWS.config.update({
  region: bucketRegion,
});

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-1:06431ed0-60d3-457c-9c6c-7866955fc5e5",
});
// Create EC2 service object
var ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

/**
 * @param  {String} Key Path of the file
 * @param  {} Body File body
 */
export const upload = (Key, Body, tag = "archive") => {
  var upload = new AWS.S3.ManagedUpload({
    partSize: 15 * 1024 * 1024,
    queueSize: 5,
    httpOptions: { timeout: 3600000 },
    params: {
      Bucket: bucketName,
      Key: Key,
      Body,
      ACL: "public-read",
    },
    tags: [{ Key: tag, Value: tagsByUseCase[tag] }],
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
