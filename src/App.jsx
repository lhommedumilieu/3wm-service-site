import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import TawkChat from './components/TawkChat.jsx'
import { trackPageView } from './lib/analytics.js'

// Chaque page (et ce qu'elle importe, ex. GSAP via Reveal) n'est chargée
// que lorsque sa route est visitée, au lieu d'alourdir le bundle initial
// de toutes les pages en même temps.
const Home = lazy(() => import('./pages/Home.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const Boutique = lazy(() => import('./pages/Boutique.jsx'))
const BlogIndex = lazy(() => import('./pages/BlogIndex.jsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'))
const Connexion = lazy(() => import('./pages/Connexion.jsx'))
const Inscription = lazy(() => import('./pages/Inscription.jsx'))
const MotDePasseOublie = lazy(() => import('./pages/MotDePasseOublie.jsx'))
const ReinitialiserMotDePasse = lazy(() => import('./pages/ReinitialiserMotDePasse.jsx'))
const EspaceMembre = lazy(() => import('./pages/EspaceMembre.jsx'))
const APropos = lazy(() => import('./pages/APropos.jsx'))
const Recommandations = lazy(() => import('./pages/Recommandations.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const MentionsLegales = lazy(() => import('./pages/MentionsLegales.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(pathname)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Aller au contenu</a>
      <TawkChat />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />
            <Route path="/espace-membre" element={<EspaceMembre />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/recommandations" element={<Recommandations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
