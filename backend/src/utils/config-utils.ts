import {Config} from "../model/config";

export function loadConfig(json: any): Config {
    if (!json.dbConnection || !json.dbUser || !json.dbPassword || !json.dbName || !json.secret) {
        throw Error("invalid configuration: missing database parameters");
    }
    const port = readValue(json.port) ?? "8080";
    return {
        port: parseInt(port, 10),
        dbConnection: readValue(json.dbConnection),
        dbUser: readValue(json.dbUser),
        dbPassword: readValue(json.dbPassword),
        dbName: readValue(json.dbName),
        secret: readValue(json.secret),
    }
}

function readValue(value?: string): string | undefined {
    if (value.startsWith('$ENV:')) {
        return process.env[value.substring(5)];
    }
    return value;
}
