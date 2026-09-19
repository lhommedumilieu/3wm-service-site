import { useParams } from 'react-router-dom'
import { getBlogPost } from '../data/blogPosts.jsx'
import NotFound from './NotFound.jsx'
import Comments from '../components/Comments.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogPost(slug)

  const structuredData = post
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          articleSection: post.category,
          author: { '@type': 'Person', name: "L'Homme-du-Milieu" },
          publisher: { '@type': 'Organization', name: '3WM Service', url: 'https://3-wm.net/' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `https://3-wm.net/blog/${post.slug}` },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://3-wm.net/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://3-wm.net/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: `https://3-wm.net/blog/${post.slug}` },
          ],
        },
      ]
    : undefined

  useDocumentMeta(
    post ? post.title : null,
    post ? post.excerpt : null,
    post ? `/blog/${post.slug}` : undefined,
    structuredData
  )

  if (!post) return <NotFound />

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>{post.title}</h1>
          <p className="post-meta">Par L'Homme-du-Milieu · {post.category}</p>
        </div>
      </div>

      <section>
        <div className="container">
          <article className="post-body" style={{ maxWidth: 720, margin: '0 auto' }}>
            <post.Body />
            <Comments slug={post.slug} />
          </article>
        </div>
      </section>
    </>
  )
}
