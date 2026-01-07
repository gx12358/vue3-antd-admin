import type { BasicLayoutProps, MenuDataItem, Meta } from '@gx-design-vue/pro-layout'
import type {
  AppRouteModule as GProAppRouteModule
} from '@gx-design-vue/pro-layout/dist/types/RouteTypings'
import type { ExtendIfDefined } from '@gx-design-vue/pro-utils'
import type { UserInfo as BasicUserInfo } from '@gx/types'
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface'

declare global {
  // 扩展 ProLayout-settings 类型
  type SystemLayoutConfig = BasicLayoutProps['settings'] & {
    colorWeak?: boolean;
    progress?: boolean;
  }

  type SystemPageState<R = undefined> = ExtendIfDefined<{
    pageNo: number;
    pageSize: number;
  }, R>

  type CommonStatus = 0 | 1

  // 系统数据字典 Key 类型
  type DictType
    = 'common_status'
    | 'system_data_scope'
    | 'sys_common_category'
    | 'system_user_sex'
    | 'system_menu_type'
    | 'system_role_type'

  type DictStatus = 'error' | 'processing' | 'success' | 'warning' | 'default' | 'pink' | 'red' | 'orange' | 'green' | 'cyan' | 'blue' | 'purple'

  // 系统数据字典 Record 类型
  interface DictRecord {
    id: any;
    status: 0 | 1;
    label: string;
    value: any;
    dictType?: DictType
    dictLabel?: string;
    dictValue?: any;
    sort?: number
    colorType?: DictStatus;
    cssClass?: string;
    remark?: string;
    createTime?: number;
  }

  // 系统用户信息 类型
  interface UserInfo extends BasicUserInfo {}

  interface DefaultTableRecord {
    id: any;
    uuid: string;
    updateTime?: string | null | Date;
    createTime?: string | null | Date;
    creator?: string;
    updater?: string;
  }

  type TableRecord<T = undefined> = ExtendIfDefined<DefaultTableRecord, T>

  type UpdateTableRecord<T = undefined> = ExtendIfDefined<Partial<DefaultTableRecord>, T>

  // 扩展 ant-design-vue DataNode 类型
  interface SystemDataNode<Key = number> extends Omit<DataNode, 'children'> {
    id: Key;
    value: Key;
    children?: SystemDataNode[];
  }

  // 扩展 SystemDataNode 类型 为 部门树状类型
  interface DeptTreeData extends Omit<SystemDataNode, 'children'> {
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
  interface SystemMenuItem extends Omit<MenuDataItem, 'children' | 'id'> {
    id?: number;
    // 1 目录 2 菜单 3 按钮
    type?: 1 | 2 | 3
    status?: 0 | 1;
    permission?: string;
    alwaysShow?: boolean;
    sort?: MenuDataItem['order']
    componentName?: MenuDataItem['name']
    children?: SystemMenuItem[]
  }
}
