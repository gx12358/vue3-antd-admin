/** 租户信息 */
export interface Tenant {
  id?: number;
  name: string;
  packageId: number;
  contactName: string;
  contactMobile: string;
  accountCount: number;
  expireTime: Date;
  websites: string[];
  status: number;
}
