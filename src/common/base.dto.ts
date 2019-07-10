export class BaseDTO {

    private errors: string[] = [];

    /**
     * Check that a string is not empty
     */
    public isValidString(value: string): boolean {
        return value != null && value.trim().length > 0;
    }

    /**
     * Add an error to the list of the dto
     * @param field the field concerned by the error
     * @param message the associated error message
     */
    public addError(field: string, message: string) {
        this.errors.push(`[${field}]: ${message}`);
    }

    /**
     * Alias of addError with a default message for empty fields
     * @param field the field concerned by the error
     */
    public addEmptyFieldError(field: string) {
        this.addError(field, 'cannot be empty');
    }

    /**
     * Check if the dto has any error
     */
    public hasError(): boolean {
        return this.errors.length > 0;
    }

    /**
     * Stringify the error list of the dto
     */
    public errorMessage(): string {
        let message = `${this.errors.length} error(s):\n`;
        message += this.errors.reduce((msg, err) => msg + ` - ${err}\n`);
        return message;
    }

    /**
     * Throw an exception if the dto has any error
     */
    public throwIfError() {
        if (this.hasError()) {
            throw new Error(this.errorMessage());
        }
    }
}
