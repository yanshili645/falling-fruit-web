import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

const SkeletonWrapper = styled.div`
  margin-bottom: 16px;
`

const SkeletonGroup = styled.div`
  margin-bottom: 20px;
`

const SkeletonLoader = ({ count = 3 }) => (
  <SkeletonWrapper>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonGroup key={index}>
        <Skeleton width="40%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="55%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="70%" height={20} />
      </SkeletonGroup>
    ))}
  </SkeletonWrapper>
)

export const LocationRowSkeleton = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 1.25rem',
      borderBottom: '1px solid #eee',
    }}
  >
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}
    >
      {/* Type name */}
      <Skeleton width={120} height={16} />
      {/* Address */}
      <Skeleton width={180} height={14} />
    </div>
    {/* Remove button placeholder */}
    <Skeleton circle width={20} height={20} />
  </div>
)

export default SkeletonLoader
