import {AfterViewInit, Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IconizFinanceServiceProxy, IconizTopicDetailDto} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/common/app-component-base';
import {FormGroup, FormControl} from '@angular/forms';
import {TopicStatusEnum} from '@shared/AppEnums';
import {AbpSessionService} from '@abp/session/abp-session.service';

@Component({
    moduleId: module.id,
    selector: 'app-mytopic-neworedit',
    templateUrl: './mytopic-neworedit.component.html',
    styleUrls: ['./mytopic-neworedit.component.css']
})
export class MytopicNeworeditComponent extends AppComponentBase implements OnInit, AfterViewInit {

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _iconizFinanceServiceProxy: IconizFinanceServiceProxy,
        private _sessionService: AbpSessionService,
    ) {
        super(injector);
        this.form = new FormGroup({
            html: new FormControl()
        });
    }

    form: FormGroup;
    config = {
        height: '500px'
    };
    private topicId;
    private model: IconizTopicDetailDto = new IconizTopicDetailDto();

    ngOnInit() {
        this.model.topicStatus = TopicStatusEnum.draft;
    }

    ngAfterViewInit(): void {
        this.topicId = this._activatedRoute.snapshot.queryParams['id'];
        if (!this.topicId || this.topicId === '0') {
            return;
        }
        abp.ui.setBusy();
        this._iconizFinanceServiceProxy.getIconizTopicDetail(this.topicId).subscribe(result => {
            abp.ui.clearBusy();
            this.model = result;
            if (this._sessionService.userId !== result.userId) {
                this.message.error('这篇文章不是您写的', '文章').done(() => {
                    this._router.navigate(['/app/author/mytopics']);
                });
            }
            this.form.get('html').setValue(result.content);
        });
    }

    sendTopic() {
        this.model.content = this.form.get('html').value;
        abp.ui.setBusy();
        this._iconizFinanceServiceProxy.newOrEditMyTopic(this.model).subscribe(result => {
            abp.ui.clearBusy();
            this.message.success('已成功修改文章', '文章').done(() => {
                this._router.navigate(['/app/author/mytopics']);
            });
        });
    }
}
