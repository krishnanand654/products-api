const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUploadMiddleware');
const authenticateToken = require('../middlewares/auth');
const { uploadFile, getFile, deleteFile, updateFile } = require('../controllers/fileController');

router.post('/upload', authenticateToken, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        console.log('Uploaded file:', req.file);

        next();
    });
}, uploadFile);



router.get('/:id', authenticateToken, getFile);

router.delete('/delete/:id', deleteFile);

router.put('/update/:id', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        console.log('Uploaded file:', req.file);

        next();
    });
}, updateFile);

module.exports = router;
