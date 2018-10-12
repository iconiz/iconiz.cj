import {AfterViewInit, OnInit, Component, Injector, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {appModuleAnimation} from '../../../shared/animations/routerTransition';
import {AppComponentBase} from '../../../shared/common/app-component-base';
import {IconizFinanceServiceProxy, IconizTopicDetailDto, IconizTopicCommentNewInput, ProfileServiceProxy} from '../../../shared/service-proxies/service-proxies';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    templateUrl: './one-news.component.html',
    styleUrls: ['./one-news.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class OneNewsComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('onenews') onenews: ElementRef;
    @ViewChild('newCommentForm') newCommentForm: ElementRef;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _profileServiceProxy: ProfileServiceProxy,
        private _iconizFinanceServiceProxy: IconizFinanceServiceProxy,
    ) {
        super(injector);
    }

    topic: IconizTopicDetailDto = new IconizTopicDetailDto();
    newComment: string;
    topicId: number;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.topicId = this._activatedRoute.snapshot.queryParams['id'];
        if (!this.topicId) {
            this._router.navigate(['main/news']);
        }
        this.getOneTopic();
    }

    getOneTopic(): void {
        abp.ui.setBusy(this.onenews.nativeElement);
        this._iconizFinanceServiceProxy.getIconizTopicDetail(this.topicId).subscribe(result => {
            abp.ui.clearBusy(this.onenews.nativeElement);
            this.topic = result;
        });
    }

    isUserLogedin(): boolean {
        return this.appSession.user != null;
    }

    sendNewComment(): void {
        if (this.newComment.length > 400) {
            this.message.error('评论不可超过400个字', '评论').done(() => {
            });
        }
        abp.ui.setBusy(this.newCommentForm.nativeElement);
        let newCommentinput = new IconizTopicCommentNewInput();
        newCommentinput.content = this.newComment;
        newCommentinput.topicId = this.topicId;
        this._iconizFinanceServiceProxy.postNewComment(newCommentinput).subscribe(result => {
            abp.ui.clearBusy(this.newCommentForm.nativeElement);
            this.message.success('已成功发表评论', '评论').done(() => {
                this.getOneTopic();
            });
        });
    }
}

