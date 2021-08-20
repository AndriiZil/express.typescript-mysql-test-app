import { Router } from 'express';
import { join } from 'path';

const r = Router();

r.get('/', (req, res, next) => {
    try {
        const filePath = join(__dirname, '../doc/index.html');

        return res.sendFile(filePath);
    } catch (err) {
        next(err);
    }
});

export default r;
