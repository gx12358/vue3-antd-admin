import type { BasicLayoutProps, MenuDataItem, Meta } from '@gx-design-vue/pro-layout'
import type { AppRouteModule as GProAppRouteModule } from '@gx-design-vue/pro-layout/dist/types/RouteTypings'
import type { UserInfo as BasicUserInfo } from '@gx/types'
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface'

declare global {
  // 扩展 ProLayout-settings 类型
  type SystemLayoutConfig = BasicLayoutProps['settings'] & {
    colorWeak?: boolean;
    progress?: boolean;
  }

  // 系统数据字典 Key 类型
  type DictType = 'common_status' | 'sys_common_category' | 'system_user_sex'

  type DictStatus = 'error' | 'processing'

  interface SystemDictRecord {
    id?: string | number;
    value: string | number;
    label: string;
  }

  // 系统数据字典 Record 类型
  interface DictRecord {
    dictType?: DictType
    dictValue: string | number
    value: string | number
    id?: number
    dictId?: number
    dictSort?: number
    dictCode?: string | number
    label: string
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
  interface UserInfo extends BasicUserInfo {}

  interface DefaultTableRecord {
    id: any;
    uuid: string;
    updateTime?: string | null;
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
  interface SystemMenuMeta extends Meta {
    permissions?: string | string[]
  }

  // 扩展 AppRouteModule 类型 为 系统路由 类型
  type AppRouteModule = Omit<GProAppRouteModule, 'meta' | 'children'> & {
    meta?: SystemMenuMeta;
    children?: AppRouteModule[]
  }

  // 扩展 AppRouteModule 类型 为 系统菜单 类型
  interface SystemMenuItem extends Omit<MenuDataItem, 'children'> {
    sort?: MenuDataItem['order']
    componentName?: MenuDataItem['name']
    children?: SystemMenuItem[]
  }
}
