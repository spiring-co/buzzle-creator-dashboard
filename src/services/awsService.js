import AWS from "aws-sdk";

const bucketName = "spiring-creator";
const bucketRegion = "us-east-1";

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-1:06431ed0-60d3-457c-9c6c-7866955fc5e5",
});
AWS.config.update({
  region: bucketRegion,
});

/**
 * @param  {String} Key Path of the file
 * @param  {} Body File body
 */
export const upload = (Key, Body) => {
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
  const response = await (new AWS.EC2().describeInstances()).promise();
  console.log(response);
  return response
}
