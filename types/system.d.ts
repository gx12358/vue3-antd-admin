import type { BasicLayoutProps, MenuDataItem, MenuMeta } from '@gx-design-vue/pro-layout'
import type { AppRouteModule as GProAppRouteModule } from '@gx-design-vue/pro-layout/dist/types/RouteTypings'
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface'

declare global {
  // 存储本地类型
  interface LocalResult<T = any> {
    value: T;
    time: string;
    expired: number;
  }

  // 扩展 ProLayout-settings 类型
  type SystemLayoutConfig = BasicLayoutProps['settings'] & {
    colorWeak?: boolean;
    progress?: boolean;
  }

  // 系统数据字典 Key 类型
  type DictType = 'sys_common_status' | 'sys_common_category' | 'sys_common_author'

  type DictStatus = 'error' | 'processing'

  // 系统数据字典 Record 类型
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

  // 系统角色信息 类型
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

  // 系统部门信息 类型
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

  // 系统用户信息 类型
  interface UserInfo {
    roles: string[];
    permissions: string[];
    user: UserDetails;
  }

  // 系统用户详情 类型
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
    signature?: string
    tags?: string
    levelName?: string
    loginDate?: string // ISO 8601 格式
    dept?: DepartBaseInfo
    roles?: RoleInfo[] // 根据具体结构可进一步定义
    roleIds?: number[]
    postIds?: number[]
    roleId?: number
    admin?: boolean
    group?: {
      title?: string
    }
  }

  interface DefaultTableRecord {
    id: any;
    uuid: string;
    createTime?: string | null;
  }

  type TableRecord<T = undefined> = T extends undefined ? DefaultTableRecord : DefaultTableRecord & T

  type UpdateTableRecord<T = undefined> = T extends undefined ? Partial<DefaultTableRecord> : Partial<DefaultTableRecord> & T

  // 扩展 ant-design-vue DataNode 类型
  interface SystemDataNode<Key = number> extends Omit<DataNode, 'children'> {
    id: Key;
    value: Key;
    children?: SystemDataNode[];
  }

  // 扩展 SystemDataNode 类型 为 部门树状类型
  interface DeptTreeData extends Omit<SystemDataNode, 'children'> {
    deptType?: DepartBaseInfo['deptType'];
    children?: DeptTreeData[];
  }

  // 扩展 MenuMeta 类型 为 菜单权限类型
  interface SystemMenuMeta extends MenuMeta {
    permissions?: string | string[]
  }

  // 扩展 AppRouteModule 类型 为 系统路由 类型
  type AppRouteModule = Omit<GProAppRouteModule, 'meta' | 'children'> & {
    meta?: SystemMenuMeta;
    children?: AppRouteModule[]
  }

  // 扩展 AppRouteModule 类型 为 系统菜单 类型
  interface SystemMenuItem extends Omit<MenuDataItem, 'children'> {
    children?: SystemMenuItem[]
  }

  class FilerobotImageEditor {
    constructor(selector: HTMLElement, options: any) {}
  }
}
