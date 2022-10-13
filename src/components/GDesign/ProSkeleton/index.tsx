import type { ListPageSkeletonProps } from './components/List'
import type { DescriptionsPageSkeletonProps } from './components/Descriptions'
import ListPageSkeleton, {
  PageHeaderSkeleton,
  ListToolbarSkeleton,
  ListSkeleton,
  ListSkeletonItem
} from './components/List'
import DescriptionsPageSkeleton, {
  TableItemSkeleton,
  DescriptionsSkeleton,
  TableSkeleton
} from './components/Descriptions'
import ResultPageSkeleton from './components/Result'

const PageSkeleton = (
  props: ListPageSkeletonProps &
    DescriptionsPageSkeletonProps & {
      type?: 'list' | 'result' | 'descriptions'
      active?: boolean
    }
) => {
  const { type = 'list', ...rest } = props
  if (type === 'result') {
    return <ResultPageSkeleton {...rest} />
  }
  if (type === 'descriptions') {
    return <DescriptionsPageSkeleton {...rest} />
  }
  return <ListPageSkeleton {...rest} />
}

export {
  ListPageSkeleton,
  ListSkeleton,
  ListSkeletonItem,
  PageHeaderSkeleton,
  ListToolbarSkeleton,
  DescriptionsSkeleton,
  TableSkeleton,
  TableItemSkeleton
}

export default PageSkeleton
