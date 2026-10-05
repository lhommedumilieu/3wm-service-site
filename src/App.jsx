import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import AiChat from './components/AiChat.jsx'
import { BandeauCloud } from './components/PromoCloud.jsx'
import { trackPageView, pingPresence } from './lib/analytics.js'
import './boutique.css'

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
const Admin = lazy(() => import('./pages/Admin.jsx'))
const ForumIndex = lazy(() => import('./pages/ForumIndex.jsx'))
const ForumSujet = lazy(() => import('./pages/ForumSujet.jsx'))
const VerifierMotDePasse = lazy(() => import('./pages/VerifierMotDePasse.jsx'))
const Avis = lazy(() => import('./pages/Avis.jsx'))
const Commander = lazy(() => import('./pages/Commander.jsx'))
const CommandeMerci = lazy(() => import('./pages/CommandeMerci.jsx'))
const CGV = lazy(() => import('./pages/CGV.jsx'))
const GuideCloud = lazy(() => import('./pages/GuideCloud.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

// Le visiteur peut refuser la mesure d'audience depuis les mentions légales.
function statistiquesRefusees() {
  try {
    return localStorage.getItem('3wm-stats-refusees') === '1'
  } catch {
    return false
  }
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (statistiquesRefusees()) return undefined
    trackPageView(pathname)
    pingPresence(pathname)
    const id = setInterval(() => pingPresence(pathname), 20000)
    return () => clearInterval(id)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Aller au contenu</a>
      <AiChat />
      <BandeauCloud />
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
            <Route path="/forum" element={<ForumIndex />} />
            <Route path="/forum/:id" element={<ForumSujet />} />
            <Route path="/verifier-mot-de-passe" element={<VerifierMotDePasse />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/avis" element={<Avis />} />
            <Route path="/commander/:formule" element={<Commander />} />
            <Route path="/commande/merci" element={<CommandeMerci />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/guide-cloud" element={<GuideCloud />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
