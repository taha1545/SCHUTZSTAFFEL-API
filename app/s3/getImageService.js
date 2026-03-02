const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("./config");

const getImage = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
    });
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

module.exports = { getImage };