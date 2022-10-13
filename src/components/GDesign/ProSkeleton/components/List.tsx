import { Skeleton } from 'ant-design-vue'
import { useMediaQuery } from '@gx-admin/hooks/event'

export type ListPageSkeletonProps = {
  active?: boolean
  pageHeader?: false
  statistic?: number | false
  actionButton?: false
  toolbar?: false
  list?: number | false
}

/**
 * @Author      gx12358
 * @DateTime    2021/8/13
 * @lastTime    2021/8/13
 * @description 一条分割线
 */
export const Line = ({ padding }: { padding?: string | number }) => (
  <div style={{ padding: padding || '0 24px' }}>
    <a-divider style={{ margin: 0 }} />
  </div>
)

export const MediaQueryKeyEnum = {
  xs: 2,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 6,
  xxl: 6
}

const StatisticSkeleton = ({ size, active }: { size?: number; active?: boolean }) => {
  const colSize = useMediaQuery()
  const arraySize = size === undefined ? MediaQueryKeyEnum[colSize.value] || 6 : size
  const firstWidth = (index: number) => {
    if (arraySize > 2 && index !== 0) {
      return 42
    }
    if (index === 0) {
      return 0
    }
    return 16
  }
  return (
    <a-card bordered={false} style={{ marginBottom: '16px' }}>
      <div
        style={{
          width: '100%',
          justifyContent: 'space-between',
          display: 'flex'
        }}
      >
        {new Array(arraySize).fill(null).map((_, index) => (
          <div
            key={index}
            style={{
              borderLeft: arraySize > 2 && index === 1 ? '1px solid rgba(0,0,0,0.06)' : undefined,
              paddingLeft: `${firstWidth(index)}px`,
              flex: 1,
              marginRight: index === 0 ? '16px' : 0
            }}
          >
            <Skeleton title={{ width: 100 }} active={active} paragraph={{ rows: 0 }} />
            <g-skeleton active={active} propsStyle={{ height: '48px' }} />
          </div>
        ))}
      </div>
    </a-card>
  )
}

/**
 * @Author      gx12358
 * @DateTime    2021/8/13
 * @lastTime    2021/8/13
 * @description 列表子项目骨架屏
 */
export const ListSkeletonItem = ({ active }: { active: boolean }) => (
  <>
    <a-card bordered={false} style={{ borderRadius: 0 }} bodyStyle={{ padding: '24px' }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ maxWidth: '100%', flex: 1 }}>
          <Skeleton title={{ width: 100 }} active={active} paragraph={{ rows: 1 }} />
        </div>
        <g-skeleton
          active={active}
          propsStyle={{ width: '165px', marginTop: '12px' }}
          size="small"
        />
      </div>
    </a-card>
    <Line />
  </>
)

/**
 * @Author      gx12358
 * @DateTime    2021/8/13
 * @lastTime    2021/8/13
 * @description 列表骨架屏
 */
export const ListSkeleton = ({
  size,
  active = true,
  actionButton
}: {
  size: number
  active?: boolean
  actionButton?: boolean
}) => (
  <a-card bordered={false} bodyStyle={{ padding: 0 }}>
    {new Array(size).fill(null).map((_, index) => (
      <ListSkeletonItem key={index} active={!!active} />
    ))}

    {actionButton !== false && (
      <a-card
        bordered={false}
        style={{
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0
        }}
        bodyStyle={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <g-skeleton active={active} propsStyle={{ width: '102px' }} size="small" />
      </a-card>
    )}
  </a-card>
)

/**
 * @Author      gx12358
 * @DateTime    2021/8/13
 * @lastTime    2021/8/13
 * @description 面包屑的 骨架屏
 */
export const PageHeaderSkeleton = ({ active }: { active: boolean }) => (
  <div style={{ marginBottom: '16px' }}>
    <Skeleton title={{ width: 185 }} active={active} paragraph={{ rows: 0 }} />
    <g-skeleton active={active} size="small" />
  </div>
)

/**
 * @Author      gx12358
 * @DateTime    2021/8/13
 * @lastTime    2021/8/13
 * @description 列表操作栏的骨架屏
 */
export const ListToolbarSkeleton = ({ active }: { active: boolean }) => (
  <a-card
    bordered={false}
    style={{
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0
    }}
    bodyStyle={{ paddingBottom: 8 }}
  >
    <a-space style={{ width: '100%', justifyContent: 'space-between' }}>
      <g-skeleton active={active} propsStyle={{ width: '200px' }} size="small" />
      <a-space align="center" direction="horizontal">
        <g-skeleton active={active} propsStyle={{ width: '120px' }} size="small" />
        <g-skeleton active={active} propsStyle={{ width: '80px' }} size="small" />
      </a-space>
    </a-space>
  </a-card>
)

const ListPageSkeleton = (props: ListPageSkeletonProps) => {
  const { active = true, statistic, actionButton, toolbar, pageHeader, list = 5 } = props
  return (
    <div style={{ width: '100%' }}>
      {pageHeader !== false && <PageHeaderSkeleton active={active} />}
      {statistic !== false && (
        <g-bars style={{ width: '100%' }}>
          <StatisticSkeleton size={statistic as number} active={active} />
        </g-bars>
      )}
      {(toolbar !== false || list !== false) && (
        <a-card bordered={false} bodyStyle={{ padding: 0 }}>
          {toolbar !== false && <ListToolbarSkeleton active={active} />}
          {list !== false && (
            <ListSkeleton size={list as number} active={active} actionButton={actionButton} />
          )}
        </a-card>
      )}
    </div>
  )
}

export default ListPageSkeleton
