class Error {
    constructor(status, errorType = "ENL", options) {
        this.status = status
        switch(errorType) {
            case 'WID': // Wring ID
                this.message = 'Wrong id.'
                break;
            case 'INC': // Id Not Conform
                this.message = 'This id isn\'t conform.'
                if(options.id != null) {
                    this.message = 'This id isn\'t conform. (Expected length: 32, current length: ' + options.id.length + ')'
                }
                break;
            case 'NEX': // Not EXist
                this.message = 'This ' + (options.element ? options.element : 'element') + ' doesn\'t exist.'
                break;
            case 'EEM': // Element EMpty
                this.message = 'This element is empty'
                if(options.element != null && options.subElement != null) {
                    this.message = 'This ' + options.element + ' has no ' + options.subElement
                }
                break;
            case 'ENL': // Error Not Listed
            default:
                this.message = 'Error, please contact loic.rojon@gmail.com'
        }
    }

    send(response) {
        response.status(this.status).send({ message: this.message })
    }
}

module.exports = Error