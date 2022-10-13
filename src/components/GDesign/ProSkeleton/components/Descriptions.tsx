import { Skeleton } from 'ant-design-vue'
import { useMediaQuery } from '@gx-admin/hooks/event'
import { PageHeaderSkeleton, Line } from './List'

export type DescriptionsPageSkeletonProps = {
  active?: boolean
  pageHeader?: false
  list?: false | number
}

const MediaQueryKeyEnum = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 3,
  xxl: 4
}

const DescriptionsLargeItemSkeleton = ({ active }: { active?: boolean }) => (
  <div style={{ marginTop: '32px' }}>
    <g-skeleton
      active={active}
      size="small"
      propsStyle={{ width: '100px', marginBottom: '16px' }}
    />
    <div
      style={{
        width: '100%',
        justifyContent: 'space-between',
        display: 'flex'
      }}
    >
      <div
        style={{
          flex: 1,
          marginRight: '24px',
          maxWidth: '300px'
        }}
      >
        <Skeleton active={active} paragraph={false} />
        <Skeleton active={active} paragraph={false} />
        <Skeleton active={active} paragraph={false} />
      </div>
      <div
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            maxWidth: '300px',
            margin: 'auto'
          }}
        >
          <Skeleton active={active} paragraph={false} />
          <Skeleton active={active} paragraph={false} />
        </div>
      </div>
    </div>
  </div>
)

const DescriptionsItemSkeleton = ({ size, active }: { size?: number; active?: boolean }) => {
  const colSize = useMediaQuery()
  const arraySize = size === undefined ? MediaQueryKeyEnum[colSize.value] || 3 : size
  return (
    <div style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
      {new Array(arraySize).fill(null).map((_, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            paddingLeft: `${index === 0 ? 0 : 24}px`,
            paddingRight: `${index === arraySize - 1 ? 0 : 24}px`
          }}
        >
          <Skeleton active={active} paragraph={false} />
          <Skeleton active={active} paragraph={false} />
          <Skeleton active={active} paragraph={false} />
        </div>
      ))}
    </div>
  )
}

export const TableItemSkeleton = ({
  active,
  header = false
}: {
  active: boolean
  header?: boolean
}) => {
  const colSize = useMediaQuery()
  const arraySize = MediaQueryKeyEnum[colSize.value] || 3
  return (
    <>
      <div
        style={{
          display: 'flex',
          background: header ? 'rgba(0,0,0,0.02)' : 'none',
          padding: '24px 8px'
        }}
      >
        {new Array(arraySize).fill(null).map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              paddingLeft: `${header && index === 0 ? 0 : 20}px`,
              paddingRight: '32px'
            }}
          >
            <Skeleton
              active={active}
              paragraph={false}
              title={{ width: header ? '75px' : '100%' }}
            />
          </div>
        ))}
        <div
          style={{
            flex: 3,
            paddingLeft: '32px'
          }}
        >
          <Skeleton active={active} paragraph={false} title={{ width: header ? '75px' : '100%' }} />
        </div>
      </div>
      <Line padding="0px 0px" />
    </>
  )
}

export const TableSkeleton = ({ active, size = 4 }: { active: boolean; size?: number }) => (
  <a-card bordered={false}>
    <g-skeleton
      active={active}
      propsStyle={{ width: '100px', marginBottom: '16px' }}
      size="small"
    />
    <TableItemSkeleton header active={active} />
    {new Array(size).fill(null).map((_, index) => (
      <TableItemSkeleton key={index} active={active} />
    ))}
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '16px'
      }}
    >
      <Skeleton active={active} paragraph={false} />
    </div>
  </a-card>
)

export const DescriptionsSkeleton = ({ active }: { active: boolean }) => (
  <a-card
    bordered={false}
    style={{
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0
    }}
  >
    <g-skeleton
      active={active}
      size="small"
      propsStyle={{ width: '100px', marginBottom: '16px' }}
    />
    <DescriptionsItemSkeleton active={active} />
    <DescriptionsLargeItemSkeleton active={active} />
  </a-card>
)

const DescriptionsPageSkeleton = ({
  active = true,
  pageHeader,
  list
}: DescriptionsPageSkeletonProps) => (
  <div
    style={{
      width: '100%'
    }}
  >
    {pageHeader !== false && <PageHeaderSkeleton active={active} />}
    <DescriptionsSkeleton active={active} />
    {list !== false && <Line />}
    {list !== false && <TableSkeleton active={active} size={list} />}
  </div>
)

export default DescriptionsPageSkeleton
