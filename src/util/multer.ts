import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../handler/api_error';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = `./public/` + file.fieldname
        if (!fs.existsSync(dir))
            return fs.mkdir(dir, error => cb(error, dir))

        return cb(null, dir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let fileName = file.originalname.match(RegExp(/^.*(?=\.[a-zA-Z]+)/g)).toString()
        fileName = fileName.toString().replace(/ /g, "_");
        cb(null, fileName + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 10485760 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg|jpeg|png/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))
        if (mimeType && extname) {
            return cb(null, true)
        } else
            cb(new BadRequestError("Invalid file format"));
    }
})