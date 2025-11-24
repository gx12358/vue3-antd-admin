import type { PropType } from 'vue'
import type { MaterialListItem } from '../typings'
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  PictureOutlined
} from '@ant-design/icons-vue'
import { GImage } from '@gx-design-vue/image'
import { unit } from '@gx-design-vue/pro-provider'
import { classNames, isFunction } from '@gx-design-vue/pro-utils'
import { Dropdown, Progress, Spin } from 'ant-design-vue'
import { pick } from 'lodash-es'
import { defineComponent } from 'vue'
import { GFileTypeIcon } from '../../file-icon'
import { useUploadContext } from '../context'
import { proUploadProps } from '../props'

const CardItem = defineComponent({
  name: 'GUploadCardItem',
  props: {
    ...pick(proUploadProps, ['fallback', 'placeholder', 'cardProps', 'dropdownMenu', 'actionsRender', 'actions', 'progress', 'shape']),
    row: {
      type: Object as PropType<MaterialListItem>,
      required: true
    },
    prefixClass: {
      type: String as PropType<string>
    },
    hashId: {
      type: String as PropType<string>
    }
  },
  setup(props) {
    const { onDownload, onView, onDelete } = useUploadContext()

    const renderChild = () => {
      const { renderClassName, renderStyle, fit } = props.cardProps
      const { fallback, placeholder } = props

      let show

      const renderPlaceholder = (
        <div class={classNames(`${props.prefixClass}-card-item-default-render`, props.hashId)}>
          <PictureOutlined />
        </div>
      )
      const renderDefaultIcon = (
        <div class={classNames(`${props.prefixClass}-card-item-default-render`, props.hashId)}>
          <GFileTypeIcon name={props.row.name} />
        </div>
      )
      switch (props.row.type) {
        case '1':
          show = (
            <GImage
              fit={fit}
              class={renderClassName}
              style={renderStyle}
              src={props.row.previewUrl || props.row.localPreviewUrl}
              fallback={isFunction(fallback) ? fallback(props.row) : renderPlaceholder}
              placeholder={isFunction(placeholder) ? placeholder(props.row) : renderPlaceholder}
            />
          )
          break
        case '2':
          show = props.row.allowPlay && props.row.url
            ? isFunction(placeholder) ? placeholder : renderDefaultIcon
            : isFunction(fallback) ? fallback : renderDefaultIcon
          break
        case '3':
          show = props.row.allowPlay && props.row.url ? (
            <>
              {
                props.row.coverImageLoaded === 'load'
                  ? renderPlaceholder
                  : (
                    <GImage
                      fit="cover"
                      style={renderStyle}
                      src={props.row.coverImg}
                      fallback={isFunction(fallback) ? fallback : renderDefaultIcon}
                      placeholder={isFunction(placeholder) ? placeholder : renderPlaceholder}
                    />
                  )
              }
            </>
          ) : isFunction(fallback) ? fallback : renderDefaultIcon
          break
        case '4':
          show = (
            props.row.url
              ? isFunction(placeholder) ? placeholder : renderDefaultIcon
              : isFunction(fallback) ? fallback : renderDefaultIcon
          )
          break
        default:
          show = (
            <GImage
              fit={fit}
              style={renderStyle}
              src={props.row.previewUrl || props.row.localPreviewUrl}
              fallback={fallback || renderDefaultIcon}
              placeholder={placeholder || renderPlaceholder}
            />
          )
          break
      }
      return show
    }

    const renderActions = (type: 'view' | 'delete' | 'download') => {
      if (props.actions[type] === false) return null

      if (isFunction(props.actions[type])) return props.actions[type](props.row)

      const Icon = {
        view: EyeOutlined,
        delete: DeleteOutlined,
        download: CloudDownloadOutlined
      }[type]

      return props.row.allowPlay && props.row.url && (
        <Icon
          class={`${props.prefixClass}-card-item-action-${type}`}
          onClick={() => {
            if (type === 'view') onView?.(props.row)
            if (type === 'download') onDownload?.(props.row)
            if (type === 'delete') onDelete?.(props.row)
          }}
        />
      )
    }

    return () => {
      const {
        className,
        style = {},
        wrapperClassName,
        width = 100,
        id,
        height
      } = props.cardProps

      return (
        <Dropdown
          get-popup-container={(el: HTMLElement) => el.parentNode as HTMLElement}
          trigger={[ 'contextmenu' ]}
          overlay={isFunction(props.dropdownMenu) ? props.dropdownMenu?.(props.row) : null}
        >
          <div
            id={id}
            style={{
              ...style,
              width: unit(width),
              height: unit(height)
            }}
            class={classNames(className, {
              [`${props.prefixClass}-card-item`]: true,
              [`${props.prefixClass}-card-item-done`]: props.row.uploadStatus === 'success',
              [`${props.prefixClass}-card-item-error`]: props.row.uploadStatus === 'exception',
              [`${props.prefixClass}-card-item-uploading`]: props.row.uploadStatus === 'active',
              [`${props.prefixClass}-card-item-circle`]: props.shape === 'circle'
            }, props.hashId)}
          >
            {props.row.loading ? (
              <>
                {props.row.progress
                  ? props.progress && isFunction(props.progress)
                    ? props.progress(props.row)
                    : (
                      <Progress
                        size={width * (2 / 3)}
                        percent={props.row.progress}
                        status={props.row.uploadStatus}
                        type="circle"
                      />
                    )
                  : <Spin size="small" tip={props.row.message} />}
              </>
            ) : (
              <div
                class={classNames(wrapperClassName, {
                  [`${props.prefixClass}-card-item-container`]: true,
                }, props.hashId)}
              >
                {renderChild()}
                {
                  isFunction(props.actionsRender)
                    ? props.actionsRender({
                      row: props.row,
                      onView: () => onView?.(props.row),
                      onDownload: () => onDownload?.(props.row),
                      onDelete: () => onDelete?.(props.row)
                    })
                    : (
                      <div class={classNames(`${props.prefixClass}-card-item-actions`, props.hashId)}>
                        <>
                          {renderActions('view')}
                          {renderActions('download')}
                          {renderActions('delete')}
                        </>
                      </div>
                    )
                }
              </div>
            )}
          </div>
        </Dropdown>
      )
    }
  }
})

export default CardItem
