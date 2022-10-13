import { initDefaultProps } from 'ant-design-vue/lib/_util/props-util'
import { buttonProps as commonButtonProps } from 'ant-design-vue/lib/button/buttonTypes'

export const buttonTypes = commonButtonProps
export const buttonProps = initDefaultProps(commonButtonProps(), { type: 'default' })
