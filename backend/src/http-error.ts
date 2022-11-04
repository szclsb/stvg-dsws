

export class HttpError extends Error {
    public static readonly BAD_REQUEST = 400;
    public static readonly UNAUTHENTICATED = 401;
    public static readonly UNAUTHORIZED = 403;
    public static readonly NOT_FOUND = 404;
    public static readonly CONFLICT = 409;
    public static readonly UNPROCESSABLE_ENTITY = 422;
    public static readonly INTERNAL_SERVER_ERROR = 500;

    public readonly code: number;

    constructor(code: number, msg: string) {
        super(msg);
        this.code = code;
    }
}
