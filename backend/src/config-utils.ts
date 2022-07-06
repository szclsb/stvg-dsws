export interface ConfigUtils {
    port: number,
    dbConnection: string,
    dbUser: string,
    dbPassword: string,
    dbName: string,
}

export function loadConfig(json: any): ConfigUtils {
    if (!json.dbConnection || !json.dbUser || !json.dbPassword || !json.dbName) {
        throw Error("invalid configuration: missing database parameters");
    }
    const port = readValue(json.port) ?? "8080";
    return {
        port: parseInt(port, 10),
        dbConnection: readValue(json.dbConnection),
        dbUser: readValue(json.dbUser),
        dbPassword: readValue(json.dbPassword),
        dbName: readValue(json.dbName),
    }
}

function readValue(value?: string): string | undefined {
    if (value.startsWith('$ENV:')) {
        return process.env[value.substring(5)];
    }
    return value;
}
