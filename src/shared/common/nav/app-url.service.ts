import {Injectable} from '@angular/core';
import {AppConsts} from '@shared/AppConsts';

@Injectable()
export class AppUrlService {
    constructor() {

    }

    get appRootUrl(): string {
        return this.getAppRootUrl();
    }

    /**
     * Returning url ends with '/'.
     */
    getAppRootUrl(): string {
        let baseUrl = this.ensureEndsWith(AppConsts.appBaseUrlFormat, '/');
        return baseUrl;
    }

    private ensureEndsWith(str: string, c: string) {
        if (str.charAt(str.length - 1) !== c) {
            str = str + c;
        }
        return str;
    }
}
