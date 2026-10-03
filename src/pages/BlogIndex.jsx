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
      <section className="page-hero page-hero-simple">
        <div className="container">
          <p className="eyebrow">Blog</p>
          <h1>
            Blog &amp; <span className="hl">tutoriels</span>
          </h1>
          <p className="lead">Des articles pratiques sur Windows, Linux et la cybersécurité, sans jargon inutile.</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="grid grid-3 blog-grid">
            {blogPosts.map((post, i) => (
              <Reveal className="card blog-card" key={post.slug} delay={(i % 3) * 0.06}>
                <span className="blog-cat">{post.category}</span>
                <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="blog-more">Lire l'article →</Link>
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
