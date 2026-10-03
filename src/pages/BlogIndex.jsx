import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import NewsletterSignup from '../components/NewsletterSignup.jsx'
import { blogPosts } from '../data/blogPosts.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function BlogIndex() {
  useDocumentMeta(
    'Blog & tutoriels',
    "Tutoriels pratiques sur Windows, Linux et la cybersécurité, écrits sans jargon inutile par 3WM Service.",
    '/blog'
  )

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">Blog</p>
          <h1>Blog &amp; tutoriels</h1>
          <p>Des articles pratiques sur Windows, Linux et la cybersécurité, sans jargon inutile.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="grid grid-2">
            {blogPosts.map((post, i) => (
              <Reveal className="card blog-card" key={post.slug} delay={(i % 2) * 0.08}>
                <p className="post-meta">{post.category}</p>
                <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`}>Lire l'article →</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container" style={{ maxWidth: 720 }}>
          <NewsletterSignup source="blog" />
        </div>
      </section>
    </>
  )
}
