import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

export default function BlogIndex() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">tail -f blog.log</p>
          <h1>Blog &amp; tutoriels</h1>
          <p>Des articles pratiques sur Linux et la cybersécurité, sans jargon inutile.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="grid grid-2">
            <Reveal className="card blog-card">
              <p className="post-meta">Prise en main</p>
              <h3><Link to="/blog/premiers-pas-terminal-linux">Premiers pas dans le terminal Linux : les commandes à connaître</Link></h3>
              <p>Un tour d'horizon des commandes essentielles pour ne plus avoir peur du terminal.</p>
              <Link to="/blog/premiers-pas-terminal-linux">Lire l'article →</Link>
            </Reveal>

            <Reveal className="card blog-card" delay={0.08}>
              <p className="post-meta">Cybersécurité</p>
              <h3><Link to="/blog/5-reflexes-cybersecurite-quotidien">5 réflexes de cybersécurité à adopter au quotidien</Link></h3>
              <p>Des gestes simples et efficaces pour réduire considérablement les risques, sans être expert.</p>
              <Link to="/blog/5-reflexes-cybersecurite-quotidien">Lire l'article →</Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
