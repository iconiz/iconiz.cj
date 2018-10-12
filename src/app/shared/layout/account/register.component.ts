import {Component, Injector, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponentBase} from '@shared/common/app-component-base';
import {AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, RegisterOutput, TokenAuthServiceProxy} from '@shared/service-proxies/service-proxies';
import {LoginService} from './login.service';
import {RegisterModel} from './register.model';
import {finalize} from 'rxjs/operators';
import {SendTwoFactorValidateCodeModel} from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'registerModal',
    templateUrl: './register.component.html'
})
export class RegisterComponent extends AppComponentBase implements OnInit {

    model: RegisterModel = new RegisterModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving = false;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private readonly _loginService: LoginService,
        private _profileService: ProfileServiceProxy,
        private _tokenAuthServiceProxy: TokenAuthServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    getCodeByEmail(): void {
        let count = 60; //计时开始
        let t; //时间间隔种子
        function checkGetCodeBtn() {
            //关于按钮
            let $getCodeBtn = $('#getCodeByEmail');
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
        this._tokenAuthServiceProxy.sendTwoFactorValidateCode(sendmodel).subscribe(result => {
        });
    }

    getCodeByPhone(): void {
        let count = 60; //计时开始
        let t; //时间间隔种子
        function checkGetCodeBtn() {
            //关于按钮
            let $getCodeBtn = $('#getCodeByPhone');
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
        this._tokenAuthServiceProxy.sendTwoFactorValidateCode(sendmodel).subscribe(result => {
        });
    }


    registByEmail(): void {
        this.saving = true;
        this._accountService.register(this.model)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe((result: RegisterOutput) => {
                if (!result.canLogin) {
                    this.notify.success(this.l('SuccessfullyRegistered'));
                    this._router.navigate(['/']);
                    return;
                }

                //Autheticate
                this.saving = true;
                this._loginService.authenticateModel.userNameOrEmailAddress = this.model.emailAddress;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => {
                    this.saving = false;
                });
            });
    }

    registByPhone(): void {
        this.saving = true;
        this._accountService.register(this.model)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe((result: RegisterOutput) => {
                if (!result.canLogin) {
                    this.notify.success(this.l('SuccessfullyRegistered'));
                    this._router.navigate(['/']);
                    return;
                }

                //Autheticate
                this.saving = true;
                this._loginService.authenticateModel.userNameOrEmailAddress = this.model.phoneNumber;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => {
                    this.saving = false;
                });
            });
    }
}
