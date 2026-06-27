import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params
  redirect(`/id/blog/${slug}`)
}