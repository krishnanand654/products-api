const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const config = require('../config');

const { ObjectId } = require('mongodb');

const uri = config.mongoURI;
const client = new MongoClient(uri);
const db = client.db();
const bucket = new GridFSBucket(db);

async function uploadFile(req, res) {
    try {
        const filename = req.file.originalname;
        const fileBuffer = req.file.buffer;

        const uploadStream = bucket.openUploadStream(filename);
        uploadStream.end(fileBuffer);

        uploadStream.on('finish', () => {
            const fileId = uploadStream.id;
            res.json({ "message": "File uploaded successfully", "fileId": fileId });
        });

        uploadStream.on('error', (error) => {
            console.error('Error uploading file:', error);
            res.status(500).send('Error uploading file');
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
}



// async function getFile(req, res) {
//     try {
//         const fileId = new ObjectId(req.params.id);

//         const fileMetadata = await db.collection('fs.files').findOne({ _id: fileId });

//         if (!fileMetadata) {
//             throw new Error('File metadata not found');
//         }


//         const filename = fileMetadata.filename;



//         const downloadStream = bucket.openDownloadStream(fileId);


// downloadStream.pipe(fs.createWriteStream(`./${filename}`));

//         downloadStream.pipe(res);



//         downloadStream.on('error', (error) => {
//             console.error('Error downloading file:', error);
//             res.status(500).send('Error downloading file');
//         });


//         downloadStream.on('end', () => {
//             console.log('File downloaded successfully');
//             res.send('File downloaded successfully');
//         });
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         if (error.message === 'File metadata not found') {
//             res.status(404).send('File not found');
//         } else {
//             res.status(500).send('Error connecting to MongoDB');
//         }
//     }
// }


async function getFile(req, res) {
    try {
        const fileId = new ObjectId(req.params.id);

        const fileMetadata = await db.collection('fs.files').findOne({ _id: fileId });

        if (!fileMetadata) {
            throw new Error('File metadata not found');
        }

        const filename = fileMetadata.filename;
        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', (error) => {
            console.error('Error downloading file:', error);
            if (!res.headersSent) {
                res.status(500).send('Error downloading file');
            }
        });

        // downloadStream.on('end', () => {
        //     console.log('File uploaded successfully');
        // });

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        downloadStream.pipe(res);

    } catch (error) {
        // console.error('Error connecting to MongoDB:', error);
        if (error.message === 'File metadata not found') {
            res.status(404).send('File not found');
        } else {
            res.status(500).send('Error connecting to MongoDB');
        }
    }
}

async function deleteFile(req, res) {
    try {
        const fileId = new ObjectId(req.params.id);

        await bucket.delete(fileId);

        res.json({ "message": "File deleted successfully" });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).send('Error deleting file');
    }
}

async function updateFile(req, res) {
    try {
        const fileId = new ObjectId(req.params.id);
        const filename = req.file.originalname;
        const fileBuffer = req.file.buffer;

        // Delete the existing file
        await bucket.delete(fileId);

        // Upload the new file with the same file_id
        const uploadStream = bucket.openUploadStreamWithId(fileId, filename);
        uploadStream.end(fileBuffer);

        uploadStream.on('finish', async () => {
            // Update fs.files with the new file information
            await db.collection('fs.files').updateOne({ _id: fileId }, { $set: { filename: filename } });

            // Optionally, update fs.chunks if necessary
            // await db.collection('fs.chunks').updateMany({ files_id: fileId }, { $set: { filename: filename } });

            res.json({ "message": "File updated successfully", "fileId": fileId });
        });

        uploadStream.on('error', (error) => {
            console.error('Error uploading file:', error);
            res.status(500).send('Error uploading file');
        });
    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).send('Error updating file');
    }
}



module.exports = {
    uploadFile, getFile, deleteFile, updateFile
};
