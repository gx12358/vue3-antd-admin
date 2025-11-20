/** 用户信息 */
export interface UserInfo {
  /**
   * 用户头像
   */
  avatar: string;
  /**
   * 部门编号
   */
  deptId: number;
  /**
   * 用户邮箱
   */
  email?: string;
  /**
   * 用户编号
   */
  id: number;
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * 用户账号
   */
  username: string;
}
