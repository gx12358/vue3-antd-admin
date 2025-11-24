import type { BasicLayoutProps, MenuDataItem, MenuMeta } from '@gx-design-vue/pro-layout'
import type { AppRouteModule as GProAppRouteModule } from '@gx-design-vue/pro-layout/dist/types/RouteTypings'
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface'

declare global {
  // 扩展 ProLayout-settings 类型
  type SystemLayoutConfig = BasicLayoutProps['settings'] & {
    colorWeak?: boolean;
    progress?: boolean;
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
    sort?: MenuDataItem['order']
    componentName?: MenuDataItem['name']
    children?: SystemMenuItem[]
  }
}
