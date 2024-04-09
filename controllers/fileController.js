const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const config = require('../config');

const { ObjectId } = require('mongodb');

const uri = config.mongoURI;
const client = new MongoClient(uri);
const db = client.db();
const bucket = new GridFSBucket(db);

function uploadFile(req, res) {
    try {


        const filename = req.file.originalname;
        const fileBuffer = req.file.buffer;

        const uploadStream = bucket.openUploadStream(filename);
        uploadStream.end(fileBuffer);

        uploadStream.on('finish', () => {
            const fileId = uploadStream.id;
            res.json({ "message": "File uploaded successfully", "fileId": fileId });
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
}


async function getFile(req, res) {
    try {
        const fileId = new ObjectId(req.params.id);

        const fileMetadata = await db.collection('fs.files').findOne({ _id: fileId });

        if (!fileMetadata) {
            throw new Error('File metadata not found');
        }


        const filename = fileMetadata.filename;



        const downloadStream = bucket.openDownloadStream(fileId);


        downloadStream.pipe(fs.createWriteStream(`./${filename}`));


        downloadStream.on('error', (error) => {
            console.error('Error downloading file:', error);
            res.status(500).send('Error downloading file');
        });


        downloadStream.on('end', () => {
            console.log('File downloaded successfully');
            res.send('File downloaded successfully');
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        if (error.message === 'File metadata not found') {
            res.status(404).send('File not found');
        } else {
            res.status(500).send('Error connecting to MongoDB');
        }
    }
}




module.exports = {
    uploadFile, getFile
};
