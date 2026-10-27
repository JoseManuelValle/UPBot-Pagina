import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'
import UPBotLogo from './UPBotLogo.jsx'
import HeroRobot from './HeroRobot.jsx'

/* =========================================================
   DATOS
   ========================================================= */

const projectData = [
  {
    slug: 'rescue',
    name: 'Rescue',
    competition: 'TMR',
    people: '8 integrantes',
    stage: 'Investigación y prototipado',
    image: '/images/rescue.webp',
    description:
      'Proyecto enfocado en desarrollar un robot para desplazarse en terrenos abruptos y participar en escenarios simulados de rescate.',
    detail:
      'Hasta contar con la ficha técnica final, aquí se incorporarán objetivos, capacidades, etapas y galería del proyecto.',
  },
  {
    slug: 'mini-sumo',
    name: 'Mini-Sumo',
    competition: 'RoboMatrix',
    people: '4 integrantes',
    stage: 'Ensamble de nueva versión',
    image: '/images/mini-sumo.webp',
    description:
      'Versión más compacta y rápida de los robots sumo, donde el tamaño reducido hace que las competencias sean más dinámicas y precisas.',
    detail:
      'Aquí se incorporarán los detalles de electrónica, mecánica, control y próximos pasos.',
  },
  {
    slug: 'sumo',
    name: 'Sumo',
    competition: 'RoboMatrix',
    people: '3 integrantes',
    stage: 'Diseño',
    image: '/images/sumo.webp',
    description:
      'Robots diseñados para empujar y sacar a otro robot de una arena circular utilizando estrategia, fuerza y sensores.',
    detail:
      'Aquí se incorporarán la plataforma, componentes, decisiones de diseño y documentación.',
  },
  {
    slug: 'sigue-lineas',
    name: 'Sigue-Líneas',
    competition: 'RoboMatrix',
    people: '5 integrantes',
    stage: 'Armado y programación',
    image: '/images/siguelineas.webp',
    description:
      'Robots programados para detectar y seguir una línea en el suelo a la mayor velocidad posible mediante sensores y programación.',
    detail:
      'Aquí se incorporarán las especificaciones, pruebas y evolución del sistema de control.',
  },
]

const competitions = ['RoboMatrix', 'TMR', 'RoboRAVE', 'RoboSTEM']

/* =========================================================
   PATROCINADORES — "reloj" (rotación por posición)
   ------------------------------------------------------------
   Hay 3 posiciones fijas en pantalla y 6 organizaciones del
   PDF (3 respaldos + 3 patrocinadores), así que cada posición
   rota entre las 2 que le tocan, con un difuminado (blur) al
   cambiar. Cada posición empieza su giro un poco después que
   la anterior, por eso se ve como una ola pasando de
   izquierda a derecha.

   Si una organización aún no tiene logo (logo: null) se muestra
   su nombre como texto. Si no tiene url, no es un enlace.

   Para agregar más organizaciones: solo agrega más objetos aquí
   abajo (se reparten solos entre las posiciones). Si cambias
   SPONSOR_SLOTS o el total deja de ser múltiplo de 3, ajusta
   también los porcentajes del @keyframes sponsor-cycle en el
   CSS (100 / cuántas toquen por posición).
   ========================================================= */
const SPONSOR_SLOTS = 3
const SPONSOR_SEGMENT_SECONDS = 5 // cuánto se ve cada logo antes de cambiar
const SPONSOR_TRANSITION_SECONDS = 0.7 // duración del cross-fade
const SPONSOR_WAVE_STAGGER = 0.6 // retraso entre una posición y la siguiente

const sponsorPool = [
  { name: 'Universidad Panamericana', logo: '/images/Logo UP.svg', url: 'https://www.up.edu.mx' },
  { name: 'Facultad de Ingeniería', logo: '/images/Facultad Ing.svg', url: null },
  { name: 'IMEP', logo: null, url: null },
  { name: 'Mexbit', logo: '/images/Mexbit.svg', url: null },
  { name: 'Ingusa', logo: '/images/logo-ingusa.svg', url: null },
  { name: 'Altium', logo: '/images/logo-altium.svg', url: 'https://www.altium.com' },
]

const painPoints = [
  {
    title: 'Todo se queda en teoría',
    text: 'Aprendes conceptos en clase, pero terminas la carrera con pocos proyectos reales que mostrar.',
  },
  {
    title: 'Sin herramientas profesionales',
    text: 'Software, componentes y equipo suelen ser caros o difíciles de conseguir por tu cuenta.',
  },
  {
    title: 'Sin comunidad ni guía',
    text: 'Empezar solo en robótica es difícil cuando nadie te enseña el proceso.',
  },
]

// role: carrera / proyecto de cada quien (ajústalo con sus datos reales)
const testimonials = [
  {
    quote: 'Por primera vez sentí que lo que aprendía sí tenía una aplicación real',
    text: 'Dentro de UPBot empecé a trabajar en proyectos reales y ganar experiencia fuera del salón. Me ayudó muchísimo a crecer profesionalmente.',
    name: 'Carlo Gordillo',
    role: 'Integrante de UPBot',
    photo: '/images/testimonios/carlo.webp',
  },
  {
    quote: 'Entré por curiosidad y terminé encontrando una comunidad',
    text: 'Además de aprender ingeniería, conocí personas con las mismas ganas de construir y crecer. Eso hizo toda la diferencia.',
    name: 'Natalia Pérez',
    role: 'Integrante de UPBot',
    photo: '/images/testimonios/natalia.webp',
  },
  {
    quote: 'UPBot cambió la forma en la que veo mi futuro profesional',
    text: 'Las competencias, proyectos y trabajo en equipo me ayudaron a desarrollar habilidades que normalmente no aprendes en clase.',
    name: 'Josemanuel Valle',
    role: 'Líder de UPBot',
    photo: '/images/testimonios/josemanuel.webp',
  },
]

/* ---------- REDES SOCIALES ----------
   Para mostrar publicaciones en el Home, pega aquí sus links
   (de Instagram: /p/... o /reel/...; de TikTok: /video/...).
   Mientras la lista esté vacía solo se ven las tarjetas de
   los perfiles. */
const socialPosts = [
  'https://www.instagram.com/upbot_gdl/p/Dee8sq1ls52/',    // ¿Qué es UPBot y qué hacemos?
  'https://www.instagram.com/upbot_gdl/reel/Dc4sh5gsXdM/', // ¿Pero qué es UPBOT?
  'https://www.instagram.com/upbot_gdl/reel/DckNAyjub5g/', // "How's the baby doing?"
  'https://www.instagram.com/upbot_gdl/reel/DccHkTEvwzF/', // Trabajo en equipo (soldando)
  // Más opciones (se ven mejor de 4 en 4):
  // 'https://www.instagram.com/upbot_gdl/reel/DdcKjuVhntn/', // POV: eres mecatrónico
  // 'https://www.instagram.com/upbot_gdl/reel/DRWHYzcDPYV/', // RoboSTEM 2025
  // De TikTok: 'https://www.tiktok.com/@upbot_gdl/video/0000000000000000000',
]

const socialProfiles = [
  {
    network: 'Instagram',
    handle: '@upbot_gdl',
    url: 'https://www.instagram.com/upbot_gdl/',
    text: 'Fotos de los robots, del taller y de cada competencia.',
  },
  {
    network: 'TikTok',
    handle: '@upbot_gdl',
    url: 'https://www.tiktok.com/@upbot_gdl',
    text: 'Videos cortos de pruebas, armado y detrás de cámaras.',
  },
]

const membershipIncludes = [
  {
    title: 'Mentorías personalizadas',
    text: 'Aprende de estudiantes con experiencia en proyectos y competencias reales.',
  },
  {
    title: 'Software profesional',
    text: 'Acceso a herramientas de ingeniería como SolidWorks y Altium.',
  },
  {
    title: 'Competencias de robótica',
    text: 'Participa en eventos y retos tecnológicos representando a la universidad.',
  },
  {
    title: 'Networking y comunidad',
    text: 'Conecta con estudiantes, patrocinadores y personas apasionadas por la innovación.',
  },
  {
    title: 'Internship y aprendizaje práctico',
    text: 'Programa de integración para desarrollar habilidades técnicas y trabajo en equipo.',
  },
  {
    title: 'Herramientas y materiales',
    text: 'Acceso a componentes, manufactura, impresoras 3D y espacios de trabajo.',
  },
]

const membershipBonus = [
  'Posibilidad de convertirte en líder',
  'Posibilidad de obtener una beca',
  'Posibilidad de acreditar labor social',
  'Aprende cosas que normalmente no enseñan en clase',
  'Construye un portafolio real',
  'Viajes y competencias',
  'Playera del equipo y 2 stickers',
]

const fitYes = [
  'Quieres experiencia real antes de graduarte',
  'Te interesa la robótica y la innovación',
  'Disfrutas trabajar en equipo',
  'Quieres aprender construyendo',
  'Buscas desarrollar proyectos reales',
  'Quieres crecer profesionalmente desde la universidad',
]

const fitNo = [
  'Solo buscas teoría',
  'No quieres colaborar con otros',
  'Esperas crecer sin involucrarte',
  'No estás dispuesto a dedicar tiempo',
  'No te interesa aprender de forma práctica',
  'No te comprometerás con el proyecto',
]

const coreValues = [
  {
    title: 'Propósito',
    text: 'Inspirar a más estudiantes a construir experiencia real a través de la robótica, la innovación y el trabajo en equipo.',
  },
  {
    title: 'Misión',
    text: 'Crear un espacio donde estudiantes desarrollen proyectos reales, aprendan haciendo y crezcan dentro de una comunidad multidisciplinaria.',
  },
  {
    title: 'Visión',
    text: 'Convertir a UPbot en un equipo universitario reconocido por su innovación, comunidad y desarrollo tecnológico.',
  },
]

const valuesList = [
  'Creatividad',
  'Compromiso',
  'Colaboración',
  'Curiosidad',
  'Innovación',
  'Responsabilidad',
]

const placeholderSections = {
  '/equipo': {
    eyebrow: '05 / EQUIPO',
    title: 'Detrás de cada robot hay un equipo.',
    intro:
      'La robótica puede parecer complicada o lejana al principio, pero descubrimos que cuando existe trabajo en equipo, mentoría y un espacio para experimentar, aprender se vuelve mucho más humano y accesible.',
    image: '/images/team.webp',
    kind: 'team',
  },
  '/competencias': {
    eyebrow: '06 / COMPETENCIAS',
    title: 'Ponemos nuestros robots a prueba.',
    intro:
      'Participar en competencias y eventos de innovación aplicando conocimientos en entornos reales.',
    image: '/images/competition-01.webp',
    kind: 'competitions',
  },
  '/nosotros': {
    eyebrow: '07 / NOSOTROS',
    title: 'Una organización universitaria que aprende haciendo.',
    intro:
      'UPbot nació porque muchos estudiantes sentíamos que aprender solo teoría no era suficiente. Queríamos un espacio donde pudiéramos construir proyectos reales, experimentar, equivocarnos y aprender haciendo.',
    image: '/images/team-working-01.webp',
    kind: 'history',
  },
}

// caption: texto que se muestra (y alt) mientras la foto no exista
const processImages = {
  design: [
    { src: '/images/manufacturing-01.webp', caption: 'Manufactura' },
    { src: '/images/manufacturing-02.webp', caption: 'Prototipos' },
    { src: '/images/components-01.webp', caption: 'Componentes' },
    { src: '/images/design-01.webp', caption: 'Diseño CAD' },
  ],
  build: [
    { src: '/images/team-working-01.webp', caption: 'Trabajo en equipo' },
    { src: '/images/team-working-02.webp', caption: 'Ensamble' },
    { src: '/images/manufacturing-03.webp', caption: 'Fabricación' },
    { src: '/images/build-01.webp', caption: 'Chasis' },
  ],
  program: [
    { src: '/images/programming-01.webp', caption: 'Programación' },
    { src: '/images/electronics-01.webp', caption: 'Electrónica' },
    { src: '/images/testing-01.webp', caption: 'Pruebas' },
    { src: '/images/programming-02.webp', caption: 'Control' },
  ],
  competition: [
    { src: '/images/competition-01.webp', caption: 'Competencia' },
    { src: '/images/competition-02.webp', caption: 'En la arena' },
    { src: '/images/team-working-03.webp', caption: 'El equipo' },
    { src: '/images/competition-03.webp', caption: 'Resultados' },
  ],
}

const processSteps = [
  {
    title: 'Diseñamos',
    text: 'Convertimos ideas en piezas, circuitos y planos con CAD, simulación y mucha prueba y error.',
  },
  {
    title: 'Construimos',
    text: 'Fabricamos y ensamblamos chasis, PCBs y mecanismos. Aquí la teoría se vuelve algo que puedes tocar.',
  },
  {
    title: 'Programamos',
    text: 'Escribimos el código que le da vida al robot: sensores, control y estrategia, probados una y otra vez.',
  },
  {
    title: 'Competimos',
    text: 'Llevamos cada robot a competencias reales y regresamos con lo aprendido para la siguiente versión.',
  },
]

// Una sola tira con todas las fotos, intercalando las etapas
const processGallery = processImages.design.flatMap((_, i) => [
  processImages.design[i],
  processImages.build[i],
  processImages.program[i],
  processImages.competition[i],
])

/* =========================================================
   COMPONENTES BASE
   ========================================================= */

import icono from './assets/upbot-head.svg'

function ImageSlot({ src, label, alt = '', className = '', loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className={`image-slot ${className}`}>
      <img
        src={src}
        alt={alt || label}
        loading={loading}
        decoding="async"
        onError={() => setFailed(true)}
      />

      {/* Sin foto: tarjeta de marca con el icono y el nombre */}
      {failed && (
        <div className="image-placeholder" aria-hidden="true">
          <img src={icono} alt="" />
          <span>{label}</span>
        </div>
      )}
    </figure>
  )
}

function SponsorLogo({ name, logo, url, active }) {
  const [failed, setFailed] = useState(false)
  const Tag = url ? 'a' : 'span'
  const linkProps = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Tag className={`sponsor-logo ${active ? 'is-active' : ''}`} {...linkProps}>
      {logo && !failed ? (
        <img
          src={logo}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="sponsor-fallback">{name}</span>
      )}
    </Tag>
  )
}

function SponsorSlot({ group, slotIndex }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (group.length <= 1) return
    let intervalId
    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        setActive((i) => (i + 1) % group.length)
      }, SPONSOR_SEGMENT_SECONDS * 1000)
    }, slotIndex * SPONSOR_WAVE_STAGGER * 1000)

    return () => {
      clearTimeout(startTimer)
      if (intervalId) clearInterval(intervalId)
    }
  }, [group.length, slotIndex])

  return (
    <div className="sponsor-slot">
      {group.map((sponsor, i) => (
        <SponsorLogo
          key={sponsor.name}
          name={sponsor.name}
          logo={sponsor.logo}
          url={sponsor.url}
          active={i === active}
        />
      ))}
    </div>
  )
}

const HERO_LINE_1 = 'Más que robots,'
const HERO_LINE_2 = 'construimos futuro.'
const TYPE_SPEED = 0.06 // segundos por letra
const TYPE_GAP = 0.35 // pausa entre la línea 1 y la línea 2
const CARET_BLINK = 0.75 // duración de cada parpadeo del cursor

function TypewriterHeading() {
  const line1Duration = HERO_LINE_1.length * TYPE_SPEED
  const line2Delay = line1Duration + TYPE_GAP
  const line2Duration = HERO_LINE_2.length * TYPE_SPEED
  const line1BlinkTimes = Math.max(1, Math.round(line2Delay / CARET_BLINK))

  const line1Style = {
    '--reveal-width': `${HERO_LINE_1.length * 1.2}ch`,
    animation: `type-reveal ${line1Duration}s steps(${HERO_LINE_1.length}, end) forwards, type-caret ${CARET_BLINK}s step-end ${line1BlinkTimes}`,
  }

  const line2Style = {
    '--reveal-width': `${HERO_LINE_2.length * 1.2}ch`,
    animation: `type-reveal ${line2Duration}s steps(${HERO_LINE_2.length}, end) ${line2Delay}s forwards, type-caret ${CARET_BLINK}s step-end ${line2Delay}s infinite`,
  }

  return (
    <h1 className="typewriter-heading">
      <span className="typewriter-line" style={line1Style}>
        {HERO_LINE_1}
      </span>
      <br />
      <span className="typewriter-line" style={line2Style}>
        <em>{HERO_LINE_2}</em>
      </span>
    </h1>
  )
}

/* Títulos de sección: suben y aparecen al entrar en pantalla */
function RevealHeading({ children }) {
  const [visible, setVisible] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  return (
    <span className={`reveal-heading ${visible ? 'is-visible' : ''}`} ref={ref}>
      {children}
    </span>
  )
}

function Avatar({ src, name }) {
  const [failed, setFailed] = useState(false)
  const initial = name.trim().charAt(0).toUpperCase()

  return (
    <span className="avatar-circle">
      {!failed ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="avatar-fallback">{initial}</span>
      )}
    </span>
  )
}

function Button({ children, href, secondary = false }) {
  return (
    <a
      className={`button ${secondary ? 'button-secondary' : 'button-primary'}`}
      href={href}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  )
}

function SectionIntro({ number, title, text, link }) {
  return (
    <div className="section-intro">
      <span className="kicker">{number}</span>
      <div>
        <h2>
          <RevealHeading>{title}</RevealHeading>
        </h2>
        <p>{text}</p>
        {link && (
          <a className="arrow-link" href={link}>
            Explorar sección <span>↗</span>
          </a>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   LAYOUT: NAVEGACIÓN Y PIE DE PÁGINA
   ========================================================= */

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    ['/proyectos', 'Proyectos'],
    ['/equipo', 'Equipo'],
    ['/competencias', 'Competencias'],
    ['/nosotros', 'Nosotros'],
  ]

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="nav shell" aria-label="Navegación principal">
        <a href="/" className="nav-logo" onClick={() => setOpen(false)}>
          <UPBotLogo />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
          <b>Menú</b>
        </button>

        <div id="main-menu" className={`nav-menu ${open ? 'is-open' : ''}`}>
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="nav-collab" href="/colabora" onClick={() => setOpen(false)}>
            Colabora
          </a>
        </div>

        <a className="nav-join" href="/unete" onClick={() => setOpen(false)}>
          Únete a UPBot <span>↗</span>
        </a>
      </nav>
    </header>
  )
}

/* =========================================================
   TICKER DE TEXTO (marquee del footer)
   ------------------------------------------------------------
   Banda decorativa de nombres en bucle infinito: mismo truco
   que las galerías de proceso, pero con texto. El track lleva
   DOS grupos idénticos y se traslada -50%, así el reinicio
   del loop es invisible. Para cambiar las palabras, edita
   tickerRows (mismas cantidades por fila o el loop se desajusta).
   ========================================================= */

const tickerRows = [
  ['UPBot', 'Rescue', 'Sumo', 'Sigue-Líneas','Mini-Sumo']
]

function FooterTicker() {
  return (
    <div className="footer-ticker" aria-hidden="true">
      {tickerRows.map((words, rowIndex) => (
        <div
          className={`ticker-row ${rowIndex % 2 ? 'ticker-row--reverse' : ''}`}
          key={`ticker-row-${rowIndex}`}
        >
          <div className="ticker-track">
            {[words, words].map((group, groupIndex) => (
              <div
                className="ticker-group"
                key={`ticker-group-${rowIndex}-${groupIndex}`}
              >
                {group.map((word) => (
                  <span className="ticker-word" key={word}>{word}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <FooterTicker />
      <div className="shell footer-grid">
        <div>
          <UPBotLogo playIntro={false} />
          <p>
            Convertir a UPbot en un equipo universitario reconocido por su
            innovación, comunidad y desarrollo tecnológico.
          </p>
        </div>

        <div>
          <small>NAVEGAR</small>
          <a href="/proyectos">Proyectos</a>
          <a href="/equipo">Equipo</a>
          <a href="/competencias">Competencias</a>
          <a href="/nosotros">Nosotros</a>
        </div>

        <div>
          <small>PARTICIPA</small>
          <a href="/unete">Únete</a>
          <a href="/colabora">Colabora</a>
          <a href="https://www.tiktok.com/@upbot_gdl">TikTok ↗</a>
          <a href="https://www.instagram.com/upbot_gdl/" target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
        </div>
      </div>

      <div className="shell footer-bottom">
        <span>Universidad Panamericana · Campus Guadalajara</span>
        <span>
          <a href="mailto:upbot@up.edu.mx?subject=Solicitud%20de%20información%20—%20UPBot&body=Hola,%20equipo%20UPBot:%0A%0AMe%20gustaría%20obtener%20más%20información%20acerca%20de%20sus%20proyectos%20y%20actividades.%0A%0ASaludos.">
            upbot@up.edu.mx
          </a>
        </span>
      </div>
    </footer>
  )
}

/* =========================================================
   COMPONENTES DE SECCIÓN
   ========================================================= */

function ProcessGallery({ images, speed = 1 }) {
  return (
    <div
      className="process-gallery"
      aria-label="Galería del proceso"
      style={{ '--marquee-duration': `${60 / speed}s` }}
    >
      <div className="process-gallery-track">
        {[images, images].map((group, groupIndex) => (
          <div className="process-gallery-group" key={`process-group-${groupIndex}`}>
            {group.map((image, index) => (
              <ImageSlot
                src={image.src}
                label={image.caption}
                className="process-image"
                key={`${image.src}-${groupIndex}-${index}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialIcon({ network }) {
  if (network === 'TikTok') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 3c.4 2.6 2.1 4.2 4.6 4.4v3.2c-1.7 0-3.2-.5-4.6-1.4v6.6a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.3a2.4 2.4 0 1 0 1.5 2.2V3h3.2z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Convierte el link de una publicación en la dirección de su embed
function socialEmbed(url) {
  const insta = url.match(/instagram\.com\/(?:[\w.]+\/)?(?:p|reel)\/([\w-]+)/)
  if (insta) return { network: 'Instagram', src: `https://www.instagram.com/p/${insta[1]}/embed` }
  const tiktok = url.match(/tiktok\.com\/.*\/video\/(\d+)/)
  if (tiktok) return { network: 'TikTok', src: `https://www.tiktok.com/embed/v2/${tiktok[1]}` }
  return null
}

function SocialSection() {
  const embeds = socialPosts.map(socialEmbed).filter(Boolean)
  const postsRef = useRef(null)

  // El embed de Instagram avisa su altura real (mensaje MEASURE):
  // se la aplicamos a su iframe para que no quede cortado ni con scroll.
  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== 'https://www.instagram.com') return
      let data
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      } catch {
        return
      }
      const height = data?.type === 'MEASURE' && data.details?.height
      if (!height || !postsRef.current) return
      const frame = [...postsRef.current.querySelectorAll('iframe')].find(
        (item) => item.contentWindow === event.source
      )
      if (frame) frame.style.height = `${Math.ceil(height)}px`
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <section className="social-section shell">
      <SectionIntro
        number="06 / SÍGUENOS"
        title="Lo que pasa en el taller."
        text="Pruebas, armado, competencias y todo lo que no cabe en una página. Síguenos para verlo primero."
      />

      <div className="social-profiles">
        {socialProfiles.map((profile) => (
          <a
            className="social-profile"
            href={profile.url}
            target="_blank"
            rel="noreferrer"
            key={profile.network}
          >
            <span className="social-profile-icon">
              <SocialIcon network={profile.network} />
            </span>
            <span className="social-profile-copy">
              <small>{profile.network}</small>
              <strong>{profile.handle}</strong>
              <span>{profile.text}</span>
            </span>
            <b>Seguir ↗</b>
          </a>
        ))}
      </div>

      {embeds.length > 0 && (
        <div className="social-posts" ref={postsRef}>
          {embeds.map((embed) => (
            <iframe
              className={`social-post social-post--${embed.network.toLowerCase()}`}
              src={embed.src}
              title={`Publicación de UPBot en ${embed.network}`}
              loading="lazy"
              scrolling="no"
              allowFullScreen
              key={embed.src}
            />
          ))}
        </div>
      )}
    </section>
  )
}

/* =========================================================
   PÁGINA: HOME
   ========================================================= */

function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* ---------- HERO ---------- */}
        <section className="hero shell">
          <div className="hero-copy">
            <span className="kicker">UPBOT / EQUIPO UNIVERSITARIO DE ROBÓTICA</span>
            <TypewriterHeading />
            <p>
              UPbot es un equipo multidisciplinario de robótica donde
              estudiantes convierten teoría en proyectos reales,
              competencias y crecimiento profesional.
            </p>

            <div className="hero-actions">
              <Button href="/proyectos">Conoce nuestros proyectos</Button>
              <Button href="/unete" secondary>Únete a UPBot</Button>
            </div>
          </div>

          <HeroRobot />
        </section>

        {/* ---------- POR QUÉ UPBOT (dolor) ---------- */}
        <section className="pain-section shell">
          <h2 className="pain-heading">
            Muchos estudiantes tienen <em>potencial</em>…
            <br />
            pero no un <em>espacio</em> para desarrollarlo
          </h2>

          <div className="pain-list">
            {painPoints.map((point) => (
              <div className="pain-item" key={point.title}>
                <h3>{point.title.toUpperCase()}</h3>
                <p>{point.text}</p>
              </div>
            ))}
          </div>

          <p className="pain-closing">
            Las mejores experiencias universitarias no solo se estudian: se
            construyen y con UPbot puedes lograrlo.
          </p>
        </section>

        {/* ---------- CIFRAS ---------- */}
        <section className="proof-strip">
          <div className="shell proof-grid">
            <div>
              <strong>24</strong>
              <span>estudiantes<br />en el equipo</span>
            </div>
            <div>
              <strong>04</strong>
              <span>proyectos<br />en desarrollo</span>
            </div>
            <div>
              <strong>2020</strong>
              <span>año en que<br />empezamos</span>
            </div>
            <div>
              <strong>→</strong>
              <span>ingeniería aplicada<br />a experiencias reales</span>
            </div>
          </div>
        </section>

        {/* ---------- PATROCINADORES ---------- */}
        <section className="sponsors-strip">
          <p className="sponsors-kicker">Respaldados por</p>
          <div className="sponsors-row">
            {Array.from({ length: SPONSOR_SLOTS }).map((_, slotIndex) => {
              // A esta posición le tocan las organizaciones en las
              // posiciones slotIndex, slotIndex+3, slotIndex+6... del pool
              const group = sponsorPool.filter(
                (_, poolIndex) => poolIndex % SPONSOR_SLOTS === slotIndex
              )

              return (
                <SponsorSlot
                  key={`slot-${slotIndex}`}
                  group={group}
                  slotIndex={slotIndex}
                />
              )
            })}
          </div>
        </section>

        {/* ---------- PROYECTOS ---------- */}
        <section className="projects-preview shell">
          <SectionIntro
            number="01 / PROYECTOS"
            title="Nuestros proyectos"
            text="Cuatro robots, cuatro retos distintos. Cada proyecto tiene su propio equipo y se prepara para una competencia específica."
            link="/proyectos"
          />

          <div className="project-mosaic project-table">
            {projectData.map((project, index) => (
              <a
                className={`project-tile tile-${index + 1}`}
                href={`/proyectos/${project.slug}`}
                key={project.slug}
              >
                <ImageSlot
                  src={project.image}
                  label={project.name}
                  className="tile-image"
                />
                <div className="tile-info">
                  <span>{project.competition}</span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <b>Ver proyecto ↗</b>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ---------- CÓMO TRABAJAMOS ---------- */}
        <section className="process-section">
          <div className="shell">
            <SectionIntro
              number="02 / CÓMO TRABAJAMOS"
              title="Del concepto a la competencia."
              text="Cada robot pasa por el mismo ciclo: lo diseñamos, lo construimos, lo programamos y lo llevamos a competir. Después volvemos a empezar con lo aprendido."
            />

            <ol className="process-steps">
              {processSteps.map((step, index) => (
                <li className="process-step" key={step.title}>
                  <span>0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <ProcessGallery images={processGallery} />
        </section>

        {/* ---------- COMPETENCIAS ---------- */}
        <section className="dark-feature">
          <div className="shell dark-feature-grid">
            <div>
              <span className="kicker">03 / COMPETENCIAS</span>
              <h2>
                <RevealHeading>Ponemos nuestros robots a prueba.</RevealHeading>
              </h2>
              <p>
                Participar en competencias y eventos de innovación aplicando
                conocimientos en entornos reales.
              </p>
              <Button href="/competencias" secondary>
                Explorar competencias
              </Button>
            </div>

            <div className="competition-list">
              {competitions.map((name, index) => (
                <a href="/competencias" key={name}>
                  <span>0{index + 1}</span>
                  <strong>{name}</strong>
                  <b>↗</b>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- EL EQUIPO ---------- */}
        <section className="team-preview shell">
          <SectionIntro
            number="04 / EL EQUIPO"
            title="Detrás de cada robot hay un equipo."
            text="Poco a poco, lo que comenzó como un grupo estudiantil se convirtió en una comunidad multidisciplinaria donde cada integrante aporta algo distinto."
            link="/equipo"
          />
          <ImageSlot
            src="/images/team.webp"
            label="El equipo UPBot"
            className="wide-image"
          />
        </section>

        {/* ---------- TESTIMONIOS ---------- */}
        <section className="testimonials-section shell">
          <span className="kicker">05 / TESTIMONIOS</span>
          <h2><RevealHeading>Lo que dicen nuestros miembros</RevealHeading></h2>

          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <article className="testimonial-card" key={item.name}>
                <div className="testimonial-photo">
                  <Avatar src={item.photo} name={item.name} />
                  <span className="testimonial-mark" aria-hidden="true">“</span>
                </div>
                <h3>{item.quote}</h3>
                <p>{item.text}</p>
                <div className="testimonial-author">
                  <b>{item.name}</b>
                  <small>{item.role}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- REDES ---------- */}
        <SocialSection />

        {/* ---------- ÚNETE ---------- */}
        <section className="join-cta">
          <div className="shell join-grid">
            <ImageSlot
              src="/images/team-working-02.webp"
              label="Únete a UPBot"
            />
            <div>
              <span className="kicker">07 / ÚNETE A UPBOT</span>
              <h2 className="dark-h2">
                <RevealHeading>¿Quieres construir algo real?</RevealHeading>
              </h2>
              <p>No guardes tu potencial, constrúyelo.</p>
              <Button href="/unete">Únete a UPBot</Button>
            </div>
          </div>
        </section>

        {/* ---------- COLABORA ---------- */}
        <section className="collab-preview shell">
          <SectionIntro
            number="08 / COLABORA"
            title="Ayúdanos a llegar más lejos."
            text="Empresas y organizaciones pueden apoyar a UPBot con patrocinio, componentes, materiales o manufactura. Tu apoyo se convierte directamente en robots, viajes a competencias y estudiantes mejor preparados."
            link="/colabora"
          />
        </section>
      </main>

      <Footer />
    </>
  )
}

/* =========================================================
   PÁGINA: LISTADO DE PROYECTOS
   ========================================================= */

function ProjectsPage() {
  return (
    <>
      <Navbar />

      <main className="inner-page shell">
        <SectionIntro
          number="01 / PROYECTOS"
          title="Proyectos en desarrollo."
          text="[PROJECTS PAGE INTRO PLACEHOLDER]"
        />

        <div className="project-list">
          {projectData.map((project) => (
            <a
              className="project-row"
              href={`/proyectos/${project.slug}`}
              key={project.slug}
            >
              <ImageSlot
                src={project.image}
                label={project.name}
              />
              <div>
                <span>{project.competition}</span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
              <b>Ver proyecto ↗</b>
            </a>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

/* =========================================================
   PÁGINA: DETALLE DE PROYECTO
   ========================================================= */

function ProjectPage({ project }) {
  return (
    <>
      <Navbar />

      <main className="inner-page project-detail shell">
        <a className="back-link" href="/proyectos">
          ← Todos los proyectos
        </a>

        <div className="detail-header">
          <div>
            <span className="kicker">PROYECTO / {project.competition}</span>
            <h1>
              <RevealHeading>{project.name}</RevealHeading>
            </h1>
            <p>{project.description}</p>
          </div>
          <ImageSlot
            src={project.image}
            label={project.name}
          />
        </div>

        <div className="detail-facts">
          <span>ETAPA <strong>{project.stage}</strong></span>
          <span>INTEGRANTES <strong>{project.people}</strong></span>
          <span>FICHA <strong>[DATOS POR AGREGAR]</strong></span>
        </div>

        <section className="detail-copy">
          <span className="kicker">[PROJECT DETAILS]</span>
          <h2>La información de este proyecto crecerá aquí.</h2>
          <p>{project.detail}</p>
        </section>
      </main>

      <Footer />
    </>
  )
}

/* =========================================================
   MÓDULOS DE PÁGINAS DE INFORMACIÓN
   ========================================================= */

const teamAreas = [
  {
    title: 'Administración',
    sub: 'Difusión, Administración general y Talento Humano.',
  },
  {
    title: 'UPbot Teams',
    sub: 'Sumo, Mini Sumo, Sigue Línea y Rescue.',
  },
  {
    title: 'UPbot Research',
    sub: 'Buenas ideas, investigación y futuros proyectos.',
  },
  {
    title: 'UPbot Internship',
    sub: 'Diseño, programación, electrónica o impartirlas.',
  },
]

const teamLeads = [
  '[LÍDER RESCUE]',
  '[LÍDER SUMO]',
  '[LÍDER SIGUE-LÍNEAS]',
  '[LÍDER MINI-SUMO]',
]

function TeamStructure() {
  return (
    <section className="team-structure">
      <span className="kicker">[TEAM STRUCTURE]</span>
      <h2><RevealHeading>Estructura del equipo.</RevealHeading></h2>
      <p className="team-structure-lead">
        Los miembros del equipo colaboran en diferentes actividades para
        poder llevar a cabo proyectos que requieren de electrónica,
        programación y diseño.
      </p>

      <div className="team-tree">
        <strong>Josemanuel Valle</strong>

        <div className="tree-branch">
          {teamLeads.map((lead) => (
            <span key={lead}>{lead}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamAreas() {
  return (
    <section className="team-areas">
      <span className="kicker">[UPBOT AREAS]</span>
      <h2><RevealHeading>Áreas de UPbot.</RevealHeading></h2>

      <div className="team-areas-grid">
        {teamAreas.map((area) => (
          <article key={area.title}>
            <h3>{area.title}</h3>
            <p>{area.sub}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   TARJETAS APILADAS (flick cards) — DÍAS DE LA SEMANA
   ------------------------------------------------------------
   Puerto del demo "Flick Cards" al lenguaje visual de UPBot.

   · 7 cartas (una por día) pero SIEMPRE se ven 5:
     2 a la izquierda + la del frente + 2 a la derecha.
     Las otras 2 quedan ocultas (opacidad 0) y entran en
     círculo al arrastrar: LUN → … → DOM → LUN → … infinito.
   · Cada carta usa ImageSlot: sin foto real se ve el
     placeholder de cuadrícula; al subir /images/day-01.webp
     (y siguientes) la imagen aparece sola.
   · Abanico simétrico: FLICK_LAYOUT define la posición para
     |offset| 0, 1, 2 y 3 (x / y / rotación / escala / opacidad).
   ========================================================= */

const FLICK_LAYOUT = [
  { x: 0,  y: 0, r: 0,  s: 1,    o: 1 },    // frente
  { x: 22, y: 2, r: 9,  s: 0.94, o: 1 },    // ±1 · visible
  { x: 40, y: 6, r: 15, s: 0.88, o: 0.96 }, // ±2 · visible (← 5 en pantalla)
  { x: 54, y: 8, r: 20, s: 0.8,  o: 0 },    // ±3 · oculta
]
const FLICK_Z = [6, 5, 4, 3]
const FLICK_DRAG_RANGE = 240     // px de arrastre = 1 gesto completo
const FLICK_PREVIEW_LIMIT = 0.55 // cuánto se adelanta el preview en vivo
const FLICK_THRESHOLD = 0.28     // arrastre mínimo para cambiar de carta

/* Una carta por día. Edita "tag" para poner qué toca ese día
   (área, horario, actividad) y sube la foto a /images/. */
const weekCards = [
  { day: 'LUNES',     tag: '[ÁREA / HORARIO]', image: '/images/day-01.webp' },
  { day: 'MARTES',    tag: '[ÁREA / HORARIO]', image: '/images/day-02.webp' },
  { day: 'MIÉRCOLES', tag: '[ÁREA / HORARIO]', image: '/images/day-03.webp' },
  { day: 'JUEVES',    tag: '[ÁREA / HORARIO]', image: '/images/day-04.webp' },
  { day: 'VIERNES',   tag: '[ÁREA / HORARIO]', image: '/images/day-05.webp' },
  { day: 'SÁBADO',    tag: '[ÁREA / HORARIO]', image: '/images/day-06.webp' },
  { day: 'DOMINGO',   tag: '[ÁREA / HORARIO]', image: '/images/day-07.webp' },
]

function FlickCards({ items }) {
  const cardRefs = useRef([])
  const drag = useRef({ active: 0, dragging: false, startX: 0, progress: 0 })
  const mobileMQ = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 760px)') : null
  )
  const n = items.length

  /* En pantallas ≤760px el abanico se compacta (k) para que las
     5 cartas sigan cabiendo en pantalla. Los % del translate ya
     se adaptan solos al tamaño de la carta. */
  const spread = () => (mobileMQ.current && mobileMQ.current.matches ? 0.55 : 1)

  const applyLayout = useCallback(
    (progress = 0) => {
      const { active } = drag.current
      const k = spread()

      const circularOffset = (i) => {
        let diff = i - active
        if (diff > n / 2) diff -= n
        if (diff < -n / 2) diff += n
        return diff
      }

      const styleFor = (absOffset) => {
        const clamped = Math.min(absOffset, FLICK_LAYOUT.length - 1)
        const i0 = Math.floor(clamped)
        const i1 = Math.min(i0 + 1, FLICK_LAYOUT.length - 1)
        const t = clamped - i0
        const a = FLICK_LAYOUT[i0]
        const b = FLICK_LAYOUT[i1]
        const lerp = (p, q) => p + (q - p) * t
        return {
          x: lerp(a.x, b.x),
          y: lerp(a.y, b.y),
          r: lerp(a.r, b.r),
          s: lerp(a.s, b.s),
          o: lerp(a.o, b.o),
        }
      }

      cardRefs.current.forEach((card, i) => {
        if (!card) return

        const rawOffset = circularOffset(i) - progress
        const abs = Math.min(Math.abs(rawOffset), FLICK_LAYOUT.length - 1)
        const sign = Math.sign(rawOffset) || 1
        const st = styleFor(abs)

        card.style.transform =
          `translate3d(${st.x * sign * k}%, ${st.y}%, 0) rotate(${st.r * sign}deg) scale(${st.s})`
        card.style.opacity = st.o

        const staticAbs = Math.min(Math.abs(circularOffset(i)), FLICK_Z.length - 1)
        card.style.zIndex = FLICK_Z[staticAbs]
      })
    },
    [n]
  )

  /* Reparte el abanico antes del primer pintado (sin flash) y
     lo recalcula si se cruza el breakpoint de móvil. */
  useLayoutEffect(() => {
    drag.current.active = 0
    applyLayout(0)

    const mq = mobileMQ.current
    const onChange = () => applyLayout(0)
    if (mq && mq.addEventListener) mq.addEventListener('change', onChange)
    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onChange)
    }
  }, [applyLayout, items])

  const setTransitions = (on) => {
    cardRefs.current.forEach((card) => {
      if (card) card.style.transition = on ? '' : 'none'
    })
  }

  const onPointerDown = (e) => {
    drag.current.dragging = true
    drag.current.startX = e.clientX
    drag.current.progress = 0
    e.currentTarget.setPointerCapture(e.pointerId)
    setTransitions(false)
  }

  const onPointerMove = (e) => {
    if (!drag.current.dragging) return
    const dx = e.clientX - drag.current.startX
    const raw = -dx / FLICK_DRAG_RANGE
    drag.current.progress = Math.max(-1, Math.min(1, raw))
    applyLayout(drag.current.progress * FLICK_PREVIEW_LIMIT)
  }

  const endDrag = () => {
    if (!drag.current.dragging) return
    drag.current.dragging = false
    setTransitions(true)

    if (drag.current.progress > FLICK_THRESHOLD) {
      drag.current.active = (drag.current.active + 1) % n
    } else if (drag.current.progress < -FLICK_THRESHOLD) {
      drag.current.active = (drag.current.active - 1 + n) % n
    }

    drag.current.progress = 0
    applyLayout(0)
  }

  /* Teclado: flechas para girar la semana */
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    if (e.key === 'ArrowRight') drag.current.active = (drag.current.active + 1) % n
    else drag.current.active = (drag.current.active - 1 + n) % n
    applyLayout(0)
  }

  return (
    <div className="flick-stack-wrap">
      <div
        className="flick-stack"
        role="group"
        tabIndex={0}
        aria-label="Días de la semana: arrastra o usa las flechas del teclado"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => (
          <article
            className="flick-card"
            key={item.day}
            ref={(el) => { cardRefs.current[i] = el }}
          >
            <div className="flick-card-media">
              <ImageSlot
                src={item.image}
                label={`${item.day} IMAGE`}
                loading="eager"
              />
            </div>
            <div className="flick-card-label">
              <b>{item.day}</b>
              <small>{item.tag}</small>
            </div>
          </article>
        ))}
      </div>

      <p className="flick-hint" aria-hidden="true">
        
      </p>
    </div>
  )
}

function CompetitionModule() {
  return (
    <section className="competition-module">
      <span className="kicker">[COMPETITIONS]</span>
      <div>
        {competitions.map((name, index) => (
          <article key={name}>
            <span>0{index + 1}</span>
            <h3>{name}</h3>
            <p>[DATE / EVENT DETAILS PLACEHOLDER]</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function HistoryTimeline() {
  const years = ['[YEAR]', '[YEAR]', '[YEAR]', '[YEAR]']

  return (
    <section className="history-timeline">
      <span className="kicker">[HISTORY]</span>
      <h2><RevealHeading>Una historia por contar.</RevealHeading></h2>

      {years.map((year, index) => (
        <article key={`${year}-${index}`}>
          <span>{year}</span>
          <div>
            <h3>[EVENT TITLE PLACEHOLDER]</h3>
            <p>[EVENT DESCRIPTION PLACEHOLDER]</p>
          </div>
        </article>
      ))}
    </section>
  )
}

function ValuesGrid() {
  return (
    <section className="values-grid">
      <span className="kicker">LO QUE NOS MUEVE AL CONSTRUIR</span>
      <h2><RevealHeading>Propósito, misión y valores.</RevealHeading></h2>

      <div className="values-cards">
        {coreValues.map((item) => (
          <article key={item.title}>
            <h3>{item.title.toUpperCase()}</h3>
            <p>{item.text}</p>
          </article>
        ))}

        <article>
          <h3>VALORES</h3>
          <ul>
            {valuesList.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

/* =========================================================
   PÁGINA: SECCIONES DE INFORMACIÓN (EQUIPO / COMPETENCIAS / NOSOTROS)
   ========================================================= */

function InfoPage({ content }) {
  return (
    <>
      <Navbar />

      <main className="inner-page info-page shell">
        <SectionIntro
          number={content.eyebrow}
          title={content.title}
          text={content.intro}
        />

        <ImageSlot
          src={content.image}
          label={content.image.split('/').pop().replace('.webp', '').toUpperCase()}
          className="wide-image"
        />

        {content.kind === 'team' && <TeamStructure />}
        {content.kind === 'team' && <TeamAreas />}
        {content.kind === 'competitions' && <CompetitionModule />}
        {content.kind === 'history' && <HistoryTimeline />}
        {content.kind === 'history' && <ValuesGrid />}
        {content.kind === 'team' ? (
  <section className="team-cards-module">
    <div className="team-cards-copy">
      <span className="kicker">¿QUIERES SER PARTE?</span>
      <h2>Únete a un área.</h2>
      <p>Cada área tiene espacio para nuevas ideas y manos extra. Aplica y te contactamos para ver en cuál encajas mejor.</p>
      <Button href="/unete">Únete a UPBot</Button>
    </div>

    <FlickCards items={weekCards} />
  </section>
) : (
  <section className="placeholder-panel">
    <span className="kicker">[CONTENT MODULE]</span>
    <h2>Información por agregar.</h2>
    <p>[PLACEHOLDER FOR REAL CONTENT, PHOTOGRAPHS, NAMES, DATES AND LINKS]</p>
    <Button href="/unete">Continuar</Button>
  </section>
)}
      </main>

      <Footer />
    </>
  )
}


/* =========================================================
   PÁGINA: ÚNETE / COLABORA
   ========================================================= */

/* =========================================================
   ABANICO DE ALIADOS (/colabora)
   ------------------------------------------------------------
   7 cartas en abanico. Por ahora usa las fotos de la demo
   (picsum): cuando tengas los logos reales solo se edita este
   array (image → /images/tu-logo.png, url → enlace real).
   ========================================================= */

const fanSponsors = [
  { name: '[PATROCINADOR 1]', image: 'https://picsum.photos/seed/lnsocial1/440/620', url: '#' },
  { name: '[PATROCINADOR 2]',   image: 'https://picsum.photos/seed/lnsocial2/440/620', url: '#' },
  { name: '[PATROCINADOR 3]',                     image: 'https://picsum.photos/seed/lnsocial3/440/620', url: '#' },
  { name: '[PATROCINADOR 4]',                   image: 'https://picsum.photos/seed/lnsocial4/440/620', url: '#' },
  { name: '[PATROCINADOR 5]',                   image: 'https://picsum.photos/seed/lnsocial5/440/620', url: '#' },
  { name: '[PATROCINADOR 6]',                   image: 'https://picsum.photos/seed/lnsocial6/440/620', url: '#' },
  { name: '[PATROCINADOR 7]',         image: 'https://picsum.photos/seed/lnsocial7/440/620', url: '#' }, // ← confirma quién es el 7º
]

function SponsorFan() {
  // índice de la carta encendida desde los recuadros (null = ninguna)
  const [boxActive, setBoxActive] = useState(null)

  /* Puente RECUADROS → CARTAS: al pasar el cursor por el recuadro N
     de la tabla (01 Patrocinio, 02 Componentes…) se enciende la carta
     N del abanico con el mismo efecto que si el cursor estuviera
     encima de ella. Al salir del recuadro, todo vuelve a la normalidad.
     La 7ª carta no tiene recuadro: solo reacciona al cursor directo.
     Si mañana agregas el 7º recuadro, se enlaza solo. */
  useEffect(() => {
    const boxes = document.querySelectorAll('.join-modules article')
    const cleanups = []

    boxes.forEach((box, i) => {
      if (i >= fanSponsors.length) return
      const onEnter = () => setBoxActive(i)
      const onLeave = () => setBoxActive((cur) => (cur === i ? null : cur))
      box.addEventListener('mouseenter', onEnter)
      box.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        box.removeEventListener('mouseenter', onEnter)
        box.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section className="socials" aria-label="Aliados de UPBot">
      {/* <div className="socials__eyebrow">RESPALDADOS POR</div>
      <h2 className="socials__title">Construido con <span>aliados</span></h2> */}

      <div className="fan">
        {fanSponsors.map((sponsor, i) => (
          <a
            className={`card ${boxActive === i ? 'is-hovered' : ''}`}
            key={sponsor.name}
            href={sponsor.url}
          >
            <img src={sponsor.image} alt={sponsor.name} loading="lazy" decoding="async" />
          </a>
        ))}
      </div>
    </section>
  )
}

function JoinPage({ collaboration = false }) {
  const title = collaboration
    ? '[COLLABORATION HEADLINE]'
    : '¿Quieres construir algo real?'
  const eyebrow = collaboration ? '09 / COLABORA' : '08 / ÚNETE A UPBOT'
  const intro = collaboration
    ? '[COLLABORATION INTRO PLACEHOLDER]'
    : 'No guardes tu potencial, constrúyelo.'

  const modules = collaboration
    ? [
        ['Patrocinio', '[PLACEHOLDER]'],
        ['Componentes', '[PLACEHOLDER]'],
        ['Materiales', '[PLACEHOLDER]'],
        ['Manufactura', '[PLACEHOLDER]'],
        ['Servicios', '[PLACEHOLDER]'],
        ['Vinculación', '[PLACEHOLDER]'],
      ]
    : [
        [
          'Qué conocimientos necesitas',
          'Muchos integrantes comienzan desde cero y aprenden dentro del equipo mediante proyectos, mentorías e internship.',
        ],
        [
          'Qué aprenderás',
          'Aprende de estudiantes con experiencia en proyectos y competencias reales.',
        ],
        [
          'Áreas del equipo',
          'UPbot cuenta con 4 equipos de robots específicos y uno de logística.',
        ],
        [
          'Cómo trabajamos',
          'Mejoramos procesos y soluciones. Cada proyecto evoluciona mediante pruebas, colaboración y mejora continua.',
        ],
        [
          '¿Cuánto tiempo requiere?',
          'Aproximadamente 9 horas semanales dependiendo del área y proyecto en el que participes o si quieres trabajar por una beca o acreditación de labor social, pero ofrecemos flexibilidad a cada caso.',
        ],
        [
          'Proceso de entrada',
          'Aplica: Llena el formulario de ingreso y cuéntanos sobre tus intereses, habilidades y motivación para formar parte del equipo. Conócenos: Tendrás una entrevista con integrantes del equipo para resolver dudas y conocer mejor tu perfil. Internship: Aprenderás procesos, herramientas y dinámicas de trabajo dentro de las distintas áreas de UPbot. Intégrate: Comienza a colaborar en proyectos reales junto a estudiantes apasionados por la innovación y la tecnología. Construye: Participa en competencias, desarrolla experiencia práctica y forma parte del crecimiento del equipo.',
        ],
      ]

  return (
    <>
      <Navbar />

      <main className="inner-page join-page shell">
        <SectionIntro
          number={eyebrow}
          title={title}
          text={intro}
        />

        {!collaboration && (
          <section className="fit-check">
            <h2><RevealHeading>¿Para quién es?</RevealHeading></h2>
            <div className="fit-check-grid">
              <div className="fit-yes">
                <span className="fit-check-mark" aria-hidden="true">✓</span>
                <h3>Sí es para ti si…</h3>
                <ul>
                  {fitYes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="fit-no">
                <span className="fit-check-mark" aria-hidden="true">✕</span>
                <h3>No es para ti si…</h3>
                <ul>
                  {fitNo.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {!collaboration && (
          <section className="all-careers-callout">
            <h3>¡Todas las carreras son bienvenidas!</h3>
            <p>
              En su mayoría el equipo está conformado por estudiantes de
              mecatrónica, sin embargo la robótica es una actividad
              multidisciplinaria en la que se requiere de diversas
              habilidades. En UPbot creemos que la clave está en sumar, por
              eso aquí todas las habilidades cuentan y todos los perfiles
              pueden aportar algo valioso.
            </p>
          </section>
        )}

        <div className="join-modules">
          {modules.map(([item, text], index) => (
            <article key={item}>
              <span>0{index + 1}</span>
              <h3>{item}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        {!collaboration && (
          <section className="investment-section">
            <h2><RevealHeading>Inversión: $0 MXN</RevealHeading></h2>
            <p>
              UPbot no se paga con dinero.
              <br />
              Se construye con compromiso, tiempo, participación, pasión y
              colaboración.
            </p>

            <div className="investment-value">
              Valor real: +$10,000 MXN en herramientas, mentorías y
              experiencia.
            </div>

            <div className="investment-grid">
              <div>
                <h3>Todo lo que incluye</h3>
                <div className="includes-list">
                  {membershipIncludes.map((item) => (
                    <article key={item.title}>
                      <h4>{item.title.toUpperCase()}</h4>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <h3>Bonus!</h3>
                <ul className="bonus-list">
                  {membershipBonus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
        
        {collaboration && <SponsorFan />}

        <section className="contact-panel">
          <h2>
            {collaboration
              ? 'Colabora con nosotros.'
              : 'Tu siguiente proyecto puede empezar aquí.'}
          </h2>
          <p>
            {collaboration
              ? '[CONTACT OR APPLICATION PLACEHOLDER]'
              : 'Cupos limitados, convocatorias solo a inicio de cada semestre.'}
          </p>
          <Button href="mailto:upbot@up.edu.mx?subject=Solicitud%20de%20información%20—%20UPBot&body=Hola,%20equipo%20UPBot:%0A%0AMe%20gustaría%20obtener%20más%20información%20acerca%20de%20sus%20proyectos%20y%20actividades.%0A%0ASaludos.">
            {collaboration ? 'Colabora con nosotros' : 'Contactar a UPBot'}
          </Button>
        </section>
      </main>

      <Footer />
    </>
  )
}

/* =========================================================
   ROUTER PRINCIPAL
   ========================================================= */

/* =========================================================
   APP — NAVEGACIÓN SPA
   ------------------------------------------------------------
   La página entra directo, sin pantalla de carga: lo único
   animado al llegar es el logo del navbar (ver UPBotLogo.jsx).
   Los <a href="/..."> se interceptan y convierten en pushState
   (sin recargar). Back/forward vía popstate.
   ========================================================= */

function scrollTopInstant() {
  // window.scrollTo respetaría el scroll-behavior:smooth del html;
  // aquí se fuerza un salto instantáneo para los cambios de ruta.
  const html = document.documentElement
  const previous = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  html.style.scrollBehavior = previous
}

function NotFound() {
  return (
    <>
      <Navbar />

      <main className="inner-page shell">
        <div className="not-found">
          <span className="kicker">ERROR 404</span>
          <h1>Página no encontrada.</h1>
          <p>La ruta que buscas no existe o se movió de lugar.</p>
          <Button href="/">Volver al inicio</Button>
        </div>
      </main>

      <Footer />
    </>
  )
}

function PageRouter({ path }) {
  if (path === '/' || path === '') return <Home />

  if (path === '/proyectos') return <ProjectsPage />

  if (path.startsWith('/proyectos/')) {
    const slug = path.replace('/proyectos/', '').replace(/\/+$/, '')
    const project = projectData.find((item) => item.slug === slug)
    if (project) return <ProjectPage project={project} />
    return <ProjectsPage />
  }

  if (placeholderSections[path]) return <InfoPage key={path} content={placeholderSections[path]} />

  if (path === '/unete') return <JoinPage />
  if (path === '/colabora') return <JoinPage collaboration />

  return <NotFound />
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const lastPath = useRef(window.location.pathname)

  const goTo = useCallback((to) => {
    scrollTopInstant()

    // Mismo destino (ej. clic en el logo ya estando en Home)
    if (to === lastPath.current) return

    lastPath.current = to
    window.history.pushState({}, '', to)
    setPath(to)
  }, [])

  useEffect(() => {
    // Evita que el navegador restaure scroll viejo con back/forward
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // back / forward del navegador
    const onPopState = () => {
      const to = window.location.pathname
      scrollTopInstant()
      if (to === lastPath.current) return
      lastPath.current = to
      setPath(to)
    }
    window.addEventListener('popstate', onPopState)

    // Convierte los <a href="/..."> del sitio en navegación
    // interna (sin recargar). Enlaces externos, mailto, descargas,
    // target="_blank" y clics con modificadores no se tocan.
    const onClick = (event) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const anchor =
        event.target instanceof Element ? event.target.closest('a') : null
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href') || ''
      if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/#')) {
        return
      }

      let url
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return

      event.preventDefault()
      goTo(url.pathname)
    }
    document.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onClick)
    }
  }, [goTo])

  return <PageRouter path={path} />
}

export default App