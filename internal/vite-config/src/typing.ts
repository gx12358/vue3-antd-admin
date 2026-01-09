import type { ViteEnv } from '@gx/types'
import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import type { PluginOptions } from 'vite-plugin-dts'

/**
 * 通用插件配置选项
 * @description 所有插件共用的基础配置
 */
interface CommonPluginOptions {
  /**
   * 是否开启开发工具
   * @default false
   */
  devtools?: boolean;
  /**
   * 环境变量
   * @description 自定义环境变量
   */
  env?: Record<string, any>;
  /**
   * 是否注入元数据
   * @default true
   */
  injectMetadata?: boolean;
  /**
   * 是否为构建模式
   * @default false
   */
  isBuild?: boolean;
  /**
   * 构建模式
   * @default 'development'
   */
  mode?: string;
  /**
   * 是否开启依赖分析
   * @default false
   * @description 使用 rollup-plugin-visualizer 分析依赖
   */
  visualizer?: boolean | PluginVisualizerOptions;
}

/**
 * 条件插件配置
 * @description 用于根据条件动态加载插件
 */
interface ConditionPlugin {
  /**
   * 判断条件
   * @description 当条件为 true 时加载插件
   */
  condition?: boolean;
  /**
   * 插件对象
   * @description 返回插件数组或 Promise
   */
  plugins: () => PluginOption[] | PromiseLike<PluginOption[]>;
}

/**
 * 归档插件配置选项
 * @description 用于配置构建产物的压缩归档
 */
interface ArchiverPluginOptions {
  /**
   * 输出文件名
   * @default 'dist'
   */
  name?: string;
  /**
   * 输出目录
   * @default '.'
   */
  outputDir?: string;
}

/**
 * 打印插件配置选项
 * @description 用于配置控制台打印信息
 */
interface PrintPluginOptions {
  /**
   * 打印的数据映射
   * @description 键值对形式的数据，将在控制台打印
   * @example
   * ```typescript
   * {
   *   'App Version': '1.0.0',
   *   'Build Time': '2024-01-01'
   * }
   * ```
   */
  infoMap?: Record<string, string | undefined>;
}

interface ApplicationPluginOptions extends CommonPluginOptions {
  /**
   * 是否开启TurboConsole
   * @default true
   */
  turboConsole?: boolean;
  /**
   * 是否开启Unocss
   * @default true
   */
  unocss?: boolean;
  /**
   * 是否开启压缩归档
   * @default false
   * @description 开启后会在打包目录生成 zip 文件
   */
  archiver?: boolean;
  /**
   * 压缩归档插件配置
   * @description 配置压缩归档的行为
   */
  archiverPluginOptions?: ArchiverPluginOptions;
  /**
   * 是否开启压缩
   * @default false
   * @description 支持 gzip 和 brotli 压缩
   */
  compress?: boolean;
  /**
   * 压缩类型
   * @default ['gzip']
   * @description 可选的压缩类型
   */
  compressTypes?: ('brotli' | 'gzip')[];
  /**
   * 是否抽离配置文件
   * @default false
   * @description 在构建时抽离配置文件
   */
  extraAppConfig?: boolean;
  /**
   * 是否开启 HTML 插件
   * @default true
   */
  html?: boolean | Record<string, any>;
  /**
   * 是否开启 Nitro Mock
   * @default false
   */
  nitroMock?: boolean;
  /**
   * Nitro Mock 插件配置
   */
  nitroMockOptions?: NitroMockPluginOptions;
  /**
   * 是否开启控制台打印
   * @default false
   */
  print?: boolean;
  /**
   * 打印插件配置
   */
  printInfoMap?: PrintPluginOptions['infoMap'];
  /**
   * 是否注入版权信息
   * @default true
   */
  license?: boolean;
  /**
   * 代理配置
   * @default undefined
   */
  proxy?: {
    target: string | Record<string, string>;
    prefix: string;
  };
}

/**
 * 应用配置选项类型
 */
type ApplicationOptions = ApplicationPluginOptions

/**
 * 应用配置定义函数类型
 * @description 用于定义应用构建配置
 */
type DefineApplicationOptions<T = undefined> = (config?: ConfigEnv & {
  env: T extends undefined ? ViteEnv : T & ViteEnv
}) => Promise<{
  /** 应用插件配置 */
  application?: ApplicationOptions;
  /** Vite 配置 */
  vite?: UserConfig;
}>

/**
 * 库插件配置选项
 * @description 用于配置库构建时的插件选项
 */
interface LibraryPluginOptions extends CommonPluginOptions {
  /**
   * 是否开启 DTS 输出
   * @default true
   * @description 生成 TypeScript 类型声明文件
   */
  dts?: boolean | PluginOptions;
}

type LibraryOptions = LibraryPluginOptions

/**
 * 库配置定义函数类型
 * @description 用于定义库构建配置
 */
type DefineLibraryOptions<T = undefined> = (config?: ConfigEnv & {
  env: T extends undefined ? ViteEnv : T & ViteEnv
}) => Promise<{
  /** 库插件配置 */
  library?: LibraryOptions;
  /** Vite 配置 */
  vite?: UserConfig;
}>

/**
 * Nitro Mock 插件配置选项
 * @description 用于配置 Nitro Mock 服务器的行为
 */
interface NitroMockPluginOptions {
  /**
   * Mock 服务器包名
   * @default '@gx/backend-mock'
   */
  mockServerPackage?: string;

  /**
   * Mock 服务端口
   * @default 3000
   */
  port?: number;

  /**
   * 是否打印 Mock 日志
   * @default false
   */
  verbose?: boolean;
}

type DefineConfig<T = undefined> = DefineApplicationOptions<T> | DefineLibraryOptions<T>

export type {
  ApplicationPluginOptions,
  ArchiverPluginOptions,
  CommonPluginOptions,
  ConditionPlugin,
  DefineApplicationOptions,
  DefineConfig,
  DefineLibraryOptions,
  LibraryPluginOptions,
  NitroMockPluginOptions,
  PrintPluginOptions
}
