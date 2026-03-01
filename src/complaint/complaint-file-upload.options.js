"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintFileMulterOptions = void 0;
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
exports.complaintFileMulterOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new common_1.BadRequestException('Only jpg, png, and pdf files are allowed'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
};
//# sourceMappingURL=complaint-file-upload.options.js.map