/** 部门信息 */
export interface Dept {
  id?: any;
  name: string;
  parentId?: number;
  status: number;
  sort: number;
  leaderUserId: number;
  phone: string;
  email: string;
  createTime?: Date;
  children?: Dept[];
}
