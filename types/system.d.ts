import type { MenuDataItem, MenuMeta } from '@gx-design-vue/pro-layout'
import type { AppRouteModule as GProAppRouteModule } from '@gx-design-vue/pro-layout/dist/types/RouteTypings'
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface'

declare global {
  interface LocalResult {
    value: any;
    time: string;
    expired: number;
  }

  type DictType = 'sys_common_status' | 'sys_common_category' | 'sys_common_author'

  interface DictRecord {
    dictType?: DictType
    dictValue: string | number
    dictId?: number
    dictSort?: number
    dictCode?: string | number
    dictLabel: string
    listClass?: string
    createTime?: string
    remark?: string
    cssClass?: string
    updateTime?: string
    updateBy?: string
    createBy?: string
    dictName?: string
    isDefault?: string
    default?: boolean
    status?: '0' | '1'
  }

  interface RoleInfo {
    createBy?: string;
    createTime?: string;
    updateBy?: string;
    updateTime?: string;
    remark: string;
    roleId?: number;
    roleName: string;
    roleKey: string;
    roleSort: number;
    dataScope?: string;
    menuCheckStrictly: boolean;
    deptCheckStrictly: boolean;
    status: string;
    value?: string;
    disabled?: boolean;
    delFlag?: string;
    flag?: boolean;
    menuIds: number[]; // 假设 menuIds 是数字数组
    deptIds: number[]; // 假设 deptIds 是数字数组
    permissions?: string[]; // 假设 permissions 是字符串数组
    admin?: boolean;
  }

  interface DepartBaseInfo {
    createBy?: string;
    createTime?: string;
    updateBy?: string;
    updateTime?: string;
    remark?: string;
    id?: number;
    key?: number;
    value?: number;
    deptId?: number;
    parentId?: number;
    ancestors?: string;
    deptName: string;
    label?: number;
    orderNum?: number;
    leader: string;
    phone: string;
    email: string;
    status: string;
    delFlag?: string;
    parentName?: string;
  }

  interface UserInfo {
    roles: string[];
    permissions: string[];
    user: UserDetails;
  }

  interface UserDetails {
    createBy?: string
    createTime?: string
    updateBy?: string
    updateTime?: string
    remark?: string
    userId?: number
    deptId?: number
    userName?: string
    nickName: string
    email: string
    introduction?: string
    address?: string
    cityCode?: string
    districtCode?: string
    provinceCode?: string
    phonenumber: string
    sex?: string // 假设 '1' 代表某种性别，可能需要进一步定义
    avatar?: string
    password?: string
    status?: string
    delFlag?: string
    loginIp?: string
    loginDate?: string // ISO 8601 格式
    dept?: DepartBaseInfo
    roles?: RoleInfo[] // 根据具体结构可进一步定义
    roleIds?: number[]
    postIds?: number[]
    roleId?: number
    admin?: boolean
  }

  interface TableRecord<T extends object> extends T {
    id: number;
  }

  interface SystemDataNode<Key = number> extends Omit<DataNode, 'children'> {
    id: Key;
    value: Key;
    children?: SystemDataNode[];
  }

  interface DeptTreeData extends Omit<SystemDataNode, 'children'> {
    deptType?: DepartBaseInfo['deptType'];
    children?: DeptTreeData[];
  }

  interface SystemMenuMeta extends MenuMeta {
    permissions?: string | string[]
  }

  type AppRouteModule = Omit<GProAppRouteModule, 'meta' | 'children'> & {
    meta?: SystemMenuMeta;
    children?: AppRouteModule[]
  }

  interface SystemMenuItem extends Omit<MenuDataItem, 'children'> {
    children?: SystemMenuItem[]
  }

  class FilerobotImageEditor {
    constructor(selector: HTMLElement, options: any) {}
  }
}
