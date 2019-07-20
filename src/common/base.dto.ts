export class BaseDTO {

    private errors: string[] = [];

    /**
     * Add an error to the list of the dto
     * @param field the field concerned by the error
     * @param message the associated error message
     */
    protected addError(field: string, message: string) {
        this.errors.push(`[${field}]: ${message}`);
    }

    /**
     * Alias of addError with a default message for empty fields
     * @param field the field concerned by the error
     */
    protected addEmptyFieldError(field: string) {
        this.addError(field, 'cannot be empty');
    }

    /**
     * Check if the dto has any error
     */
    protected hasError(): boolean {
        return this.errors.length > 0;
    }

    /**
     * Stringify the error list of the dto
     */
    protected errorMessage(): string {
        let message = `${this.errors.length} error(s):\n`;
        message += this.errors.reduce((msg, err) => msg + ` - ${err}\n`);
        return message;
    }

    /**
     * Throw an exception if the dto has any error
     */
    protected throwIfError() {
        if (this.hasError()) {
            throw new Error(this.errorMessage());
        }
    }
}
