import { defineComponent } from 'vue'
import { RouteRecordRaw } from 'vue-router'

export type Component<T extends any = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

declare global {
  type AppRouteModule = {
    meta?: Meta;
    linkPath?: string;
    children?: AppRouteModule[];
    hidden?: boolean;
    component?: Component;
  } & Omit<RouteRecordRaw, 'meta' | 'children'>

  interface MenuDataItem extends MenuMeta {
    id?: number;
    menuId?: number;
    parentId?: number;
    createTime?: string;
    menuType?: string;
    orderNum?: string;
    name?: string;
    path?: string;
    target?: string;
    linkPath?: string;
    key?: string;
    redirect?: string;
    component: string;
    hidden?: boolean;
    meta?: MenuMeta;
    children?: MenuDataItem[];
  }

  interface MenuMeta {
    // 名称
    title?: string;
    // 是否外链 0:是 1:否
    isFrame?: '0' | '1';
    // 主页
    homePageFlag?: 1 | 0;
    // 菜单图标
    icon?: string;
    // 菜单图标类型
    iconType?: 0 | 1 | 2;
    // //外链类型（选择是系统内则以iframe形式在系统内部展示，否则跳转新页面打开） 0:系统内 1:系统外
    outLinkType?: 0 | 1;
    // 标签栏显示状态（隐藏的路由是否显示在标签栏中（只有标签栏为显示转态才生效））0:显示 1:隐藏
    tagHidden?: '0' | '1';
    // 标签栏固定状态（标签栏路由地址是否固定（只有标签栏为显示转态才生效））0:是 1:否
    tagFixed?: '0' | '1';
  }

  interface Meta {
    // 名称
    title: string;
    // 主页
    homePage?: 1 | 0;
    // 菜单图标
    icon?: string;
    // 菜单图标类型
    iconType?: number;
    //隐藏
    hidden?: boolean;
    // 菜单隐藏
    hideInMenu?: boolean;
    // 菜单以及children隐藏
    hideChildrenInMenu?: boolean;
    // 外链类型
    targetStatus?: number;
    // 外链地址
    target?: string;
    // 标签栏显示状态（隐藏的路由是否显示在标签栏中（只有标签栏为显示转态才生效））
    tagHidden?: boolean;
    // 标签栏固定状态（标签栏路由地址是否固定（只有标签栏为显示转态才生效））
    tagFixed?: boolean;
    type?: string;
    disabled?: boolean;
    danger?: boolean;
  }
}
