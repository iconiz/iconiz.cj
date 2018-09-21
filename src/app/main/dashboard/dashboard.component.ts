import {AfterViewInit, OnInit, Component, Injector, ViewEncapsulation} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {AppComponentBase} from '@shared/common/app-component-base';
import {IconizFinanceServiceProxy, JinseTopicListOutput, JinseLiveOutput, JinseLiveOutputList, JinseLiveOutputListLives, JinseLiveOutputListLivesImages} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {

    constructor(
        injector: Injector,
        private _iconizFinanceServiceProxy: IconizFinanceServiceProxy,
    ) {
        super(injector);
    }

    last_id;
    topicListItems: JinseTopicListOutput[];
    topicSignal: JinseTopicListOutput;
    liveItems: JinseLiveOutputListLives[];

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.getTopicList(undefined);
        this.getLive();
    }

    getTopicList(last_id): void {
        this._iconizFinanceServiceProxy.getJinseTopic(last_id).subscribe(result => {
            this.topicListItems = result;
            this.last_id = this.topicListItems[this.topicListItems.length - 1].id;
            this._iconizFinanceServiceProxy.getJinseTopic(this.last_id).subscribe(result1 => {
                for(let item of result1){
                    this.topicListItems.push(item);
                }
                this.last_id = this.topicListItems[this.topicListItems.length - 1].id;
            });
        });
    }

    getLive(): void {
        this._iconizFinanceServiceProxy.getJinseLive().subscribe(result => {
            this.liveItems = result.list[0].lives;
        });
    }

    pageDown(): void {
        this.getTopicList(this.last_id);
    }

    getTime(input): string{
        if (input === undefined) {
            return '';
        }
       return moment.unix(input).toString();
    }

    showSignal(post: JinseTopicListOutput): void {
        this.topicSignal = post;
    }

    hideSignal(): void {
        this.topicSignal = undefined;
    }
}

