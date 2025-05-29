class BaseError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new BaseError(401, "User is not authorized");
    }

    static BadRequest(message, errors = []) {
        return new BaseError(400, message, errors);
    }
}

module.exports = BaseError;
