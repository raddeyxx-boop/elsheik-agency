import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, BriefcaseBusiness, CheckCircle2, ClipboardCheck, FileCheck2, GraduationCap, HeartHandshake, Lightbulb, Map, MessageCircle, School, Search, Send, Sparkles, Users } from 'lucide-react'
import Header from '../components/Header'
import SectionTitle from '../components/SectionTitle'
import CollegeCard from '../components/CollegeCard'
import CollegeModal from '../components/CollegeModal'
import RegistrationForm from '../components/RegistrationForm'
import StudyDestinationsSection from '../components/study-destinations/StudyDestinationsSection'
import GlobalStudyGlobe from '../components/hero/GlobalStudyGlobe'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import aliPhoto from '../assets/ali-elsheik.jpg'
import { getColleges } from '../services/data'
import type { College } from '../types'
import { Link } from 'react-router-dom'
import { getStoredSession } from '../services/englishTest'
import { usePreferences } from '../context/PreferencesContext'
import { resources } from '../i18n/resources'

const serviceIcons = [Lightbulb, Search, FileCheck2, School, HeartHandshake, Map]
const stepIcons = [Send, GraduationCap, Users, ClipboardCheck, FileCheck2, Award]

export default function HomePage() {
  const { language } = usePreferences()
  const copy = resources[language]
  const englishCourse = new URLSearchParams(window.location.search).get('englishCourse') === '1'
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState<College | null>(null)
  const [selectedName, setSelectedName] = useState(englishCourse ? (language==='en'?'ElSheik Education Agency':'وكالة الشيخ التعليمية') : '')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [registrationSource, setRegistrationSource] = useState<'public_form' | 'english_test' | 'study_destination'>(englishCourse ? 'english_test' : 'public_form')
  const load = () => {
    setLoading(true); setError(false)
    getColleges().then(setColleges).catch(() => setError(true)).finally(() => setLoading(false))
  }
  useEffect(load, [])
  const registerFor = (name: string) => {
    setSelected(null); setSelectedName(name); setRegistrationSource(englishCourse ? 'english_test' : 'public_form')
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }
  const registerForDestination = (countryName: string) => {
    setSelectedCountry(countryName)
    setRegistrationSource('study_destination')
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }
  return <div className="site">
    <Header />
    <main>
      <section id="home" className="hero">
        <div className="hero-shape shape-one" /><div className="hero-shape shape-two" />
        <div className="container hero-grid">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow"><Sparkles size={17} /> {copy.hero.eyebrow}</span>
            <h1>{copy.hero.title}<br /><em>{copy.hero.accent}</em></h1>
            <p>{copy.hero.description}</p>
            <div className="hero-actions"><button className="btn primary" onClick={() => registerFor('')}>{copy.hero.primary}</button><button className="btn secondary" onClick={() => document.getElementById('colleges')?.scrollIntoView({ behavior: 'smooth' })}>{copy.hero.secondary}</button></div>
            <div className="trust-row">{copy.hero.trust.map(item=><span key={item}><CheckCircle2 /> {item}</span>)}</div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .15 }}>
            <GlobalStudyGlobe />
            <div className="mini-stat"><strong>{copy.hero.stepTitle}</strong><span>{copy.hero.stepDescription}</span></div>
          </motion.div>
        </div>
        <div className="hero-wave" />
      </section>

      <section id="about" className="section about">
        <div className="container about-grid">
          <motion.div className="portrait-wrap" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="portrait-bg" /><img src={aliPhoto} alt={copy.about.imageAlt} />
            <span className="portrait-badge"><Award /> {copy.about.badge}</span>
          </motion.div>
          <div className="about-copy">
            <SectionTitle eyebrow={copy.about.eyebrow} title={copy.about.title} />
            <h3>{copy.about.lead}</h3><p>{copy.about.paragraph1}</p><p>{copy.about.paragraph2}</p>
            <div className="about-points">{copy.about.highlights.map(x => <span key={x}><CheckCircle2 />{x}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="services" className="section services">
        <div className="container">
          <SectionTitle eyebrow={copy.services.eyebrow} title={copy.services.title} text={copy.services.description} />
          <div className="service-grid">{copy.services.items.map(([title, text], i) => { const Icon=serviceIcons[i]; return <motion.article className="service-card" key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }} viewport={{ once: true }}><span className="service-icon"><Icon /></span><h3>{title}</h3><p>{text}</p><span className="service-index">{String(i+1).padStart(2,'0')}</span></motion.article>})}</div>
        </div>
      </section>

      <StudyDestinationsSection onRegister={registerForDestination} />

      <section id="english-test" className="section test-promo"><div className="container"><motion.div className="test-promo-card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><div><span className="eyebrow">اختبار مصغر مستوحى من مهارات اختبارات اللغة الدولية</span><h2>اعرف مستواك في اللغة الإنجليزية</h2><p>اختبر مهاراتك في الاستماع والكتابة خلال 8 دقائق، واحصل على تقييم مبدئي لمستواك ونصائح تساعدك على التطور.</p><div className="test-promo-facts"><span>🎧 الاستماع</span><span>✍️ الكتابة</span><span>⏱ 8 دقائق</span></div><Link className="btn primary" to="/english-test">ابدأ الاختبار</Link><small>الاختبار مجاني والنتيجة تقديرية.</small></div><div className="test-promo-art">Aa</div></motion.div></div></section>

      <section className="section why">
        <div className="container why-grid">
          <div><SectionTitle eyebrow={copy.why.eyebrow} title={copy.why.title} /><p className="lead">{copy.why.description}</p><a className="btn light" href="https://wa.me/919036102240" target="_blank" rel="noreferrer"><MessageCircle /> {copy.why.button}</a></div>
          <div className="benefit-grid">{copy.why.items.map((b, i) => <div className="benefit" key={b}><strong>{String(i + 1).padStart(2, '0')}</strong><span>{b}</span></div>)}</div>
        </div>
      </section>

      <section id="colleges" className="section colleges">
        <div className="container">
          <SectionTitle eyebrow={copy.colleges.eyebrow} title={copy.colleges.title} text={copy.colleges.description} />
          {loading && <div className="college-grid">{[1,2,3].map(x => <div className="skeleton" key={x} />)}</div>}
          {error && <div className="empty-state"><p>{copy.colleges.loadError}</p><button className="btn primary" onClick={load}>{copy.colleges.retry}</button></div>}
          {!loading && !error && colleges.length === 0 && <div className="empty-state">{copy.colleges.empty}</div>}
          {!loading && !error && <div className="college-grid">{colleges.map(c => <CollegeCard key={c.id} college={c} onDetails={() => setSelected(c)} onRegister={() => registerFor(language==='en'?(c.name_en||c.name):c.name)} />)}</div>}
        </div>
      </section>

      <section id="steps" className="section steps">
        <div className="container"><SectionTitle eyebrow={copy.steps.eyebrow} title={copy.steps.title} /><div className="steps-grid">{copy.steps.items.map(([title, text], i) => {const Icon=stepIcons[i]; return <div className="step" key={title}><span className="step-number">{i + 1}</span><div className="step-icon"><Icon /></div><h3>{title}</h3><p>{text}</p></div>})}</div></div>
      </section>

      <section id="contact" className="section contact">
        <div className="container contact-grid">
          <div className="contact-copy"><span className="eyebrow"><Sparkles /> {copy.application.badge}</span><h2>{copy.application.title}</h2><p>{copy.application.description}</p><div className="contact-card"><BriefcaseBusiness /><div><strong>{copy.application.consultationTitle}</strong><span>{copy.application.consultationText}</span></div></div><div className="contact-card"><MessageCircle /><div><strong>{copy.application.contactTitle}</strong><span>{copy.application.contactText}</span></div></div></div>
          <RegistrationForm selectedCollege={selectedName} selectedCourse={englishCourse ? (language==='en'?'English Language Course':'دورة اللغة الإنجليزية') : ''} selectedCountry={selectedCountry} source={registrationSource} assessmentAttemptId={englishCourse ? getStoredSession()?.attemptId : undefined} />
        </div>
      </section>
    </main>
    <Footer /><WhatsAppButton />
    <CollegeModal college={selected} onClose={() => setSelected(null)} onRegister={() => registerFor(selected?.name || '')} />
  </div>
}
