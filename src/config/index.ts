import * as dotenv from 'dotenv';
import { join } from 'path';

const configEnvFilePath = join(__filename, '../../../.env');

const { error } = dotenv.config({ path: configEnvFilePath });

if (error) {
    throw error;
}

export default ({
    port: process.env.PORT || 3000,
    env: process.env.ENV,
});
