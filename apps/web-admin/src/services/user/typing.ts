/** 登录接口参数 */
export interface LoginParams {
  password?: string;
  username?: string;
  captchaVerification?: string;
  // 绑定社交登录时，需要传递如下参数
  socialType?: number;
  socialCode?: string;
  socialState?: string;
}

/** 登录接口返回值 */
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  userId: number;
  expiresTime: number;
}

/** 手机验证码获取接口参数 */
export interface SmsCodeParams {
  mobile: string;
  scene: number;
}

/** 手机验证码登录接口参数 */
export interface SmsLoginParams {
  mobile: string;
  code: string;
}

/** 注册接口参数 */
export interface RegisterParams {
  username: string;
  password: string;
  captchaVerification: string;
}

/** 重置密码接口参数 */
export interface ResetPasswordParams {
  password: string;
  mobile: string;
  code: string;
}

/** 社交快捷登录接口参数 */
export interface SocialLoginParams {
  type: number;
  code: string;
  state: string;
}

/** 权限信息返回值 */
export interface AuthPermissionInfo {
  user: UserInfo;
  roles: string[];
  permissions: string[];
  menus: SystemMenuItem[];
}
