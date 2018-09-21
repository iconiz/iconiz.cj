import {Component, Injector, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponentBase} from '@shared/common/app-component-base';
import {AppUrlService} from '@shared/common/nav/app-url.service';
import {AccountServiceProxy, CheckPasswordResetCodeInput, SendTwoFactorValidateCodeModel, TokenAuthServiceProxy} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {ResetPasswordComponent} from './reset-password.component';
import {ModalDirective} from '@node_modules/ngx-bootstrap';

@Component({
    selector: 'forgetModal',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent extends AppComponentBase {

    @ViewChild('resetModal') resetModal: ResetPasswordComponent;
    model: CheckPasswordResetCodeInput = new CheckPasswordResetCodeInput();

    saving = false;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _appUrlService: AppUrlService,
        private _router: Router,
        private _tokenAuthServiceProxy: TokenAuthServiceProxy
    ) {
        super(injector);
    }

    getCodeByEmail(): void {
        let count = 60; //计时开始
        let t; //时间间隔种子
        function checkGetCodeBtn() {
            //关于按钮
            let $getCodeBtn = $('#getCodeByEmail2');
            t = setInterval(function () {
                    $getCodeBtn.html(count + '秒之后重新获取');
                    $getCodeBtn.prop('disabled', true);
                    count--;
                    if (count === 0) {
                        clearInterval(t);
                        $getCodeBtn.prop('disabled', false);
                        $getCodeBtn.html('发送验证码');
                        count = 60;
                    }
                },
                1000);
        }

        checkGetCodeBtn();
        let sendmodel = new SendTwoFactorValidateCodeModel();
        sendmodel.userName = this.model.emailAddress;
        sendmodel.provider = 'Email';
        this._tokenAuthServiceProxy.sendTwoFactorValidateCode(sendmodel).subscribe(() => {
            this.message.success(this.l('PasswordResetMailSentMessage'), this.l('MailSent')).done(() => {
            });
        });
    }

    getCodeByPhone(): void {
        let count = 60; //计时开始
        let t; //时间间隔种子
        function checkGetCodeBtn() {
            //关于按钮
            let $getCodeBtn = $('#getCodeByPhone2');
            t = setInterval(function () {
                    $getCodeBtn.html(count + '秒之后重新获取');
                    $getCodeBtn.prop('disabled', true);
                    count--;
                    if (count === 0) {
                        clearInterval(t);
                        $getCodeBtn.prop('disabled', false);
                        $getCodeBtn.html('发送验证码');
                        count = 60;
                    }
                },
                1000);
        }

        checkGetCodeBtn();
        let sendmodel = new SendTwoFactorValidateCodeModel();
        sendmodel.userName = this.model.phoneNumber;
        sendmodel.provider = 'Phone';
        this._tokenAuthServiceProxy.sendTwoFactorValidateCode(sendmodel).subscribe(() => {
            this.message.success(this.l('PasswordResetCodePhoneSentMessage'), this.l('PhoneCodeSent')).done(() => {
            });
        });
    }

    save(): void {
        this.saving = true;
        this._accountService.checkPasswordResetCode(this.model)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(result => {
                if (!result.isCodeValidate) {
                    this.message.error(this.l('WrongValidateCode!'), this.l('WrongValidateCode')).done(() => {
                    });
                } else {
                    $('#forget-password-form').modal('hide')
                    this.resetModal.show(result.userId, result.passwordResetCode);
                }
            });
    }

}
