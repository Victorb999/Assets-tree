import RenderAsyncTest from '@/components/TreeList/RenderAsyncTest'
import { Suspense } from 'react'

interface PageProps {
  params: { id: string }
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Loading rota...</div>}>
      <RenderAsyncTest id={params.id} />{' '}
    </Suspense>
  )
}
