import * as dotenv from 'dotenv';

let path: string;
switch (process.env.NODE_ENV) {
    case "test":
        path = `${__dirname}/test.env`;
        break;
    case "development":
        path = `${__dirname}/development.env`;
        break;
    case "production":
        path = `src/config/production.env`;
        break;
}
dotenv.config({ path });
