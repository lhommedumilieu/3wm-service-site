import { useParams } from 'react-router-dom'
import { getBlogPost } from '../data/blogPosts.jsx'
import NotFound from './NotFound.jsx'
import Comments from '../components/Comments.jsx'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogPost(slug)

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
