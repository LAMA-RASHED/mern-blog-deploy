class ErrorResponse extends Error{
    constructor(statusCode, message){
        // super is used to call the constructor of the parent class
        super(message);
        this.statusCode = statusCode
    }
}

module.exports = ErrorResponse;