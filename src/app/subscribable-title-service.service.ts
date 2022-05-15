import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class SubscribableTitleServiceService {
    public title: BehaviorSubject<string>;

    constructor(private titleService: Title) {
        this.title = new BehaviorSubject<string>(titleService.getTitle());
    }

    setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);

        this.title.next(newTitle);
    }
}
