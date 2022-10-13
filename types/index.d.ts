declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

declare type EmitType = (event: string, ...args: any[]) => void;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;
