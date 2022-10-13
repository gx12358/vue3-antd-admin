export type Fn = () => void


export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return


export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>
  args: Args
  thisArg: This
}

export interface RenderableComponent {
  as?: Object | string
}


