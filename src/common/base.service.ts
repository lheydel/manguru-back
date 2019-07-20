import { isValidString } from './utils';

export class BaseService {

    /**
     * Throw if the given id is empty
     * @param id the id to check
     * @param operation the operation name for the error message
     */
    protected checkString(str: string, operation: string, field: string) {
        if (!isValidString(str)) {
            throw new Error(`${operation}: ${field} cannot be empty`);
        } // else
    }
}
