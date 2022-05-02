import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

export abstract class AbstractArrayFetcherService<M> {
    protected currentData: Array<M> = [];
    private subjectUpdated = new Subject<{ data: Array<M> }>();
    public isDownloading = false;

    constructor(
        protected http: HttpClient,
        private routeUrl: string,
    ) {

    }

    private onError(error: any) {
        this.isDownloading = false;
        console.log('Error occured:' + error.message);
    }

    public fetch(payload?: any) {
        this.isDownloading = true;
        const completeURL = this.routeUrl;
        const params: any = payload ? payload : {};

        this.http.post<{ result: Array<M>; }>(completeURL, { parameters: params }).subscribe({
            next: (res) => {
                const data: Array<M> = res.result;
                this.currentData = data;
                this.subjectUpdated.next({ data: this.currentData });
                this.isDownloading = false;
                console.info(`Emitted ${this.constructor.name} data`);
            },
            error: (error) => this.onError(error)
        });
    }

    /** Similar to fetch but this function is allowed to use the cached version */
    public getData(payload?: any) {
        if (this.currentData.length === 0) {
            this.fetch(payload ? payload : null);
        } else {
            console.log(`Using cache of ${this.constructor.name}`);
            this.subjectUpdated.next({ data: this.currentData });
        }
    }

    public getIsDownloading(): boolean {
        return this.isDownloading;
    }

    public getUpdateListener() {
        return this.subjectUpdated.asObservable();
    }

}
