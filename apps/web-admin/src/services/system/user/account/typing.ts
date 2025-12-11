/** 用户个人中心信息 */
export interface UserProfileRespVO {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  mobile?: string;
  sex?: number;
  avatar?: string;
  loginIp: string;
  loginDate: string;
  createTime: string;
  roles: any[];
  dept: any;
  posts: any[];
}

/** 更新密码请求 */
export interface UpdatePasswordReqVO {
  oldPassword: string;
  newPassword: string;
}

/** 更新个人信息请求 */
export interface UpdateProfileReqVO {
  nickname?: string;
  email?: string;
  mobile?: string;
  sex?: number;
  avatar?: string;
}
