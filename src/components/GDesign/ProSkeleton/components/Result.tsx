import { PageHeaderSkeleton } from './List'

type ResultPageSkeletonProps = {
  active?: boolean
  pageHeader?: false
}

const ResultPageSkeleton = ({ active = true, pageHeader }: ResultPageSkeletonProps) => (
  <div style={{ width: '100%' }}>
    {pageHeader !== false && <PageHeaderSkeleton active={active} />}
    <a-card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '128px'
        }}
      >
        <g-skeleton type="avatar" active={active} propsStyle={{ marginBottom: '32px' }} size={64} />
        <g-skeleton active={active} propsStyle={{ width: '214px', marginBottom: '8px' }} />
        <g-skeleton active={active} propsStyle={{ width: '328px' }} size="small" />
        <a-space style={{ marginTop: '24px' }}>
          <g-skeleton active={active} propsStyle={{ width: '116px' }} />
          <g-skeleton active={active} propsStyle={{ width: '116px' }} />
        </a-space>
      </div>
    </a-card>
  </div>
)

export default ResultPageSkeleton
