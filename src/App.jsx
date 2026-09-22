import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'

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

   Los logos usan demoLogo() como imagen TEMPORAL hasta que
   existan los archivos reales.

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

/* Genera una imagen de prueba "al vuelo" (no es un archivo real)
   solo para poder VER la animación funcionando mientras no haya
   logos de verdad. BÓRRALA cuando pongas las rutas reales. */
function demoLogo(text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="40">
    <rect width="100%" height="100%" rx="4" fill="#e3e6ee"/>
    <text x="50%" y="56%" font-family="sans-serif" font-size="11" fill="#29385f" text-anchor="middle">${text}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const sponsorPool = [
  { name: 'Universidad Panamericana', logo: '/images/Logo UP.svg', url: '#' },
  { name: 'Facultad de Ingeniería', logo: '/images/Facultad Ing.svg', url: '#' },
  { name: 'IMEP', logo: demoLogo('IMEP'), url: '#' },
  { name: 'Mexbit', logo: '/images/Mexbit.svg', url: '#'},
  { name: 'Ingusa', logo: '/images/logo-ingusa.svg', url: '#'},
  { name: 'Altium', logo: '/images/logo-altium.svg', url: '#'},
]

const painPoints = [
  {
    title: 'Todo se queda en teoría',
    text: 'Aprendes conceptos en clase pero pocas veces construyes proyectos reales.',
  },
  {
    title: 'No sabes cómo diferenciarte',
    text: 'Muchos estudiantes terminan la carrera sin experiencia práctica ni proyectos reales.',
  },
  {
    title: 'No tienes acceso a herramientas profesionales',
    text: 'Software, componentes y tecnología suelen ser costosos o inaccesibles.',
  },
  {
    title: 'Te falta comunidad',
    text: 'A veces aprender solo hace que la ingeniería se sienta fría y lejana.',
  },
  {
    title: 'No sabes cómo empezar',
    text: 'La robótica puede parecer difícil cuando nadie te enseña el proceso.',
  },
]

const testimonials = [
  {
    quote: 'Por primera vez sentí que lo que aprendía sí tenía una aplicación real',
    text: 'Dentro de UPbot empecé a trabajar en proyectos reales y ganar experiencia fuera del salón. Me ayudó muchísimo a crecer profesionalmente.',
    name: 'Carlo Gordillo',
    photo: '/images/Carlo.png',
  },
  {
    quote: 'Entré por curiosidad y terminé encontrando una comunidad',
    text: 'Además de aprender ingeniería, conocí personas con las mismas ganas de construir y crecer. Eso hizo toda la diferencia.',
    name: 'Natalia Pérez',
    photo: '/images/Natalia.png',
  },
  {
    quote: 'UPbot cambió la forma en la que veo mi futuro profesional',
    text: 'Las competencias, proyectos y trabajo en equipo me ayudaron a desarrollar habilidades que normalmente no aprendes en clase.',
    name: 'Josemanuel Valle, Líder UPbot',
    photo: '/images/Josemanuel.png',
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

const processImages = {
  design: [
    '/images/manufacturing-01.webp',
    '/images/manufacturing-02.webp',
    '/images/components-01.webp',
    '/images/design-01.webp',
  ],
  build: [
    '/images/team-working-01.webp',
    '/images/team-working-02.webp',
    '/images/manufacturing-03.webp',
    '/images/build-01.webp',
  ],
  program: [
    '/images/programming-01.webp',
    '/images/electronics-01.webp',
    '/images/testing-01.webp',
    '/images/programming-02.webp',
  ],
  competition: [
    '/images/competition-01.webp',
    '/images/competition-02.webp',
    '/images/team-working-03.webp',
    '/images/competition-03.webp',
  ],
}

/* =========================================================
   COMPONENTES BASE
   ========================================================= */

import logoWhite from "./assets/UPBotWhite.svg";
import logoBlack from "./assets/UPBotBlack.svg";
import icono from "./assets/icono.svg"; 

function LogoWhite() {
  return (
    <img
      src={logoWhite}
      alt="UPBot"
      className="logo-lockup"
    />
  );
}

function LogoBlack() {
  return (
    <img
      src={logoBlack}
      alt="UPBot"
      className="logo-lockup"
    />
  );
}

function Icono() {
  return (
    <img
      src={icono}
      alt="UPBot"
      className="icono-lockup"
    />
  );
}

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

      {failed && (
        <div className="image-placeholder">
          <span>IMG / SLOT</span>
          <strong>[{label}]</strong>
          <small>{src}</small>
        </div>
      )}

      <figcaption>{label}</figcaption>
    </figure>
  )
}

function SponsorLogo({ name, logo, url, active }) {
  const [failed, setFailed] = useState(false)

  return (
    <a
      className={`sponsor-logo ${failed ? 'is-placeholder' : active ? 'is-active' : ''}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {!failed ? (
        <img
          src={logo}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="sponsor-fallback">
          <small>IMG / SLOT</small>
          <strong>{name}</strong>
        </span>
      )}
    </a>
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

/* TypewriterHeading recibe "start":
   · start=false → las líneas quedan ocultas (su base CSS ya es
     max-width: 0) y SIN animación. Así el tecleo NO corre por
     detrás del intro de Home.
   · start=true  → se aplican las animaciones inline y el efecto
     corre desde cero en ese preciso momento.
   El "start" lo alimenta App con "introDone" (= !showIntro). */
function TypewriterHeading({ start = true }) {
  const line1Duration = HERO_LINE_1.length * TYPE_SPEED
  const line2Delay = line1Duration + TYPE_GAP
  const line2Duration = HERO_LINE_2.length * TYPE_SPEED
  const line1BlinkTimes = Math.max(1, Math.round(line2Delay / CARET_BLINK))

  const line1Style = start
    ? {
        '--reveal-width': `${HERO_LINE_1.length * 1.2}ch`,
        animation: `type-reveal ${line1Duration}s steps(${HERO_LINE_1.length}, end) forwards, type-caret ${CARET_BLINK}s step-end ${line1BlinkTimes}`,
      }
    : undefined

  const line2Style = start
    ? {
        '--reveal-width': `${HERO_LINE_2.length * 1.2}ch`,
        animation: `type-reveal ${line2Duration}s steps(${HERO_LINE_2.length}, end) ${line2Delay}s forwards, type-caret ${CARET_BLINK}s step-end ${line2Delay}s infinite`,
      }
    : undefined

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

const TITLE_TYPE_SPEED = 0.045 // segundos por letra
const TITLE_TYPE_DELAY = 0.35 // pausa tras entrar en pantalla

function TypewriterTitle({ text }) {
  const [started, setStarted] = useState(false)
  const [count, setCount] = useState(0)
  const holderRef = useRef(null)
  const done = count >= text.length

  // Dispara la animación UNA sola vez, al entrar en pantalla
  useEffect(() => {
    const el = holderRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Teclea letra a letra
  useEffect(() => {
    if (!started) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length)
      return
    }
    let interval = null
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval)
            return c
          }
          return c + 1
        })
      }, TITLE_TYPE_SPEED * 1000)
    }, TITLE_TYPE_DELAY * 1000)
    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [started, text])

  return (
    <span className="typewriter-title" ref={holderRef}>
      <span className="typewriter-title-ghost" aria-hidden="true">{text}</span>
      <span className="typewriter-title-live" aria-hidden="true">
        {text.slice(0, count)}
        <span className={`typewriter-title-caret ${done ? 'is-done' : ''}`} />
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}

function RevealHeading({ children }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
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
  }, [])

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
          <TypewriterTitle text={title} />
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
        <a href="/" onClick={() => setOpen(false)}>
          <LogoBlack />
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
          <LogoWhite />
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

function PlaceholderBand({ images, label, text = '[SHORT DESCRIPTION PLACEHOLDER]', children, reverse = false, speed = 1 }) {
  return (
    <article className={`editorial-row ${reverse ? 'reverse' : ''}`}>
      <div className="editorial-copy">
        <span className="kicker">Nuestro método</span>
        <h3>{children}</h3>
        <p>{text}</p>
      </div>

      <div
        className="process-gallery"
        aria-label={`${label} gallery`}
        style={{ '--marquee-duration': `${30 / speed}s` }}
      >
        <div className="process-gallery-track">
          {[images, images].map((group, groupIndex) => (
            <div
              className="process-gallery-group"
              key={`${label}-group-${groupIndex}`}
            >
              {group.map((image, index) => (
                <ImageSlot
                  src={image}
                  label={`${label} ${String(index + 1).padStart(2, '0')}`}
                  className="process-image"
                  loading="eager"
                  key={`${image}-${groupIndex}-${index}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

/* =========================================================
   PÁGINA: HOME
   ========================================================= */

/* introDone lo inyecta App (= !showIntro): mientras corre el
   intro, el tecleo del hero permanece pausado y oculto; arranca
   desde cero en cuanto el intro termina. */
function Home({ introDone = true }) {
  return (
    <>
      <Navbar />

      <main>
        {/* ---------- HERO ---------- */}
        <section className="hero shell">
          <div className="hero-copy">
            <span className="kicker">UPBOT / EQUIPO UNIVERSITARIO DE ROBÓTICA</span>
            <TypewriterHeading start={introDone} />
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

          <ImageSlot
            src="/images/hero-robot.webp"
            label="HERO ROBOT IMAGE"
            className="hero-image"
          />
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
              <span>estudiantes<br />[CONFIRMAR DATO]</span>
            </div>
            <div>
              <strong>04</strong>
              <span>proyectos<br />[CONFIRMAR DATO]</span>
            </div>
            <div>
              <strong>2020</strong>
              <span>inicio del proyecto<br />[CONFIRMAR DATO]</span>
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
            text="[PROJECTS INTRO PLACEHOLDER]"
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
                  label={`${project.name.toUpperCase()} IMAGE`}
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
              text="[PROCESS INTRO PLACEHOLDER]"
            />

            <div className="editorial-stack">
              <PlaceholderBand
                images={processImages.design}
                label="DESIGN IMAGE"
                speed={0.8}
                text="Diseñamos y desarrollamos proyectos. Convertimos ideas en soluciones reales a través de ingeniería, creatividad y experimentación práctica."
              >
                Diseñamos.
              </PlaceholderBand>
              <PlaceholderBand images={processImages.build} label="BUILD IMAGE" reverse speed={1.15}>
                Construimos.
              </PlaceholderBand>
              <PlaceholderBand images={processImages.program} label="PROGRAM IMAGE" speed={0.65}>
                Programamos.
              </PlaceholderBand>
              <PlaceholderBand
                images={processImages.competition}
                label="COMPETITION IMAGE"
                reverse
                speed={1.3}
                text="Probamos, competimos y aprendemos. Aplicamos nuestros conocimientos en competencias y experiencias reales donde cada desafío forma parte del aprendizaje."
              >
                Competimos.
              </PlaceholderBand>
            </div>
          </div>
        </section>

        {/* ---------- COMPETENCIAS ---------- */}
        <section className="dark-feature">
          <div className="shell dark-feature-grid">
            <div>
              <span className="kicker">03 / COMPETENCIAS</span>
              <h2>
                <TypewriterTitle text="Ponemos nuestros robots a prueba." />
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
            label="TEAM IMAGE"
            className="wide-image"
          />
        </section>

        {/* ---------- TESTIMONIOS ---------- */}
        <section className="testimonials-section shell">
          <span className="kicker">TESTIMONIOS</span>
          <h2><RevealHeading>Lo que dicen nuestros miembros</RevealHeading></h2>

          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <article className="testimonial-card" key={item.name}>
                <span className="testimonial-mark" aria-hidden="true">"</span>
                <h3>{item.quote}</h3>
                <p>{item.text}</p>
                <div className="testimonial-author">
                  <Avatar src={item.photo} name={item.name}/>
                  <b>{item.name}</b>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- ÚNETE ---------- */}
        <section className="join-cta">
          <div className="shell join-grid">
            <ImageSlot
              src="/images/team-working-02.webp"
              label="TEAM WORKING IMAGE"
            />
            <div>
              <span className="kicker">08 / ÚNETE A UPBOT</span>
              <h2 className="dark-h2">
                <TypewriterTitle text="¿Quieres construir algo real?" />
              </h2>
              <p>No guardes tu potencial, constrúyelo.</p>
              <Button href="/unete">Únete a UPBot</Button>
            </div>
          </div>
        </section>

        {/* ---------- COLABORA ---------- */}
        <section className="collab-preview shell">
          <SectionIntro
            number="09 / COLABORA"
            title="[COLLABORATION HEADLINE]"
            text="[COLLABORATION INTRO PLACEHOLDER]"
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
                label={`${project.name.toUpperCase()} IMAGE`}
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
              <TypewriterTitle text={project.name} />
            </h1>
            <p>{project.description}</p>
          </div>
          <ImageSlot
            src={project.image}
            label={`${project.name.toUpperCase()} IMAGE`}
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
   INTRO LOADER (UNA ejecución por visita: la primera vez que
   el usuario llega a Home durante esa visita)
   ------------------------------------------------------------
   Secuencia completa:

     1 · Las fotos se van apilando una encima de otra (ninguna
        desaparece: la pila queda siempre visible).
     2 · Sobre la pila entra el póster azul con el logo blanco
         completo centrado (LogoWhite) y el video arrancando
         desde 0s en ese preciso momento.
     3 · El póster crece hasta llenar la pantalla y, mientras
         tanto, el logo se reduce (zoom out) y el icono toma su
         lugar en el centro.
     4 · El icono se queda visible (respirando muy sutil) y
         todo hace fade para revelar el Home.

   Cuándo corre lo decide <App/> (ver la sección APP abajo): se
   monta la primera vez que el usuario llega a Home con el
   loading aún pendiente y, como la bandera de "ya ejecutado"
   se marca al dispararse, no vuelve a montarse hasta que
   exista una nueva carga completa de la web (F5 / pestaña
   nueva / nueva visita).
   ========================================================= */

const INTRO_FRAME_MS = 130 // ritmo con el que cae cada foto sobre la pila
const INTRO_STACK_TAIL_MS = 260 // pausa tras apilar la última foto
const INTRO_LOGO_HOLD_MS = 600 // cuánto se ve el logo completo antes de reducirse
const INTRO_GROW_MS = 700 // crecimiento del póster a pantalla completa
const INTRO_ICON_LEAD_MS = 420 // el logo empieza a reducirse antes de que termine el crecimiento
const INTRO_ICON_MS = 700 // duración de la transición logo → icono
const INTRO_ICON_HOLD_MS = 500 // cuánto se queda solo el icono en pantalla
const INTRO_FADE_MS = 500 // fade final del loader hacia el Home

// Para apilar TUS propias imágenes (o tu logo): importa los
// archivos arriba (con los demás imports, ej.
// import miFoto from './assets/mi-foto.webp') y reemplaza las
// rutas de esta lista.
const introImages = [
  'https://cdn.prod.website-files.com/656759acf6013e1492415a32/68052f16d090290d350e8c89_img%201.avif',
  'https://cdn.prod.website-files.com/656759acf6013e1492415a32/6805301b88f0cd575978a25a_image%202.avif',
  'https://cdn.prod.website-files.com/656759acf6013e1492415a32/680531728d47b543c1e20397_3.avif',
  'https://cdn.prod.website-files.com/656759acf6013e1492415a32/68053265d0576dff0d7bafc5_3.avif',
  'https://cdn.prod.website-files.com/656759acf6013e1492415a32/6806c45ecbb081bb1386a6a7_111.avif',
  'https://cdn.prod.website-files.com/656759acf6013e1492415a32/68067948d71e49256cad0502_6.avif',
  'https://cdn.prod.website-files.com/656759acf6013e1492415a32/691cf1c1c6bf3285a915a543_Slide%2080-p-1600.png',
]

// Inclinación de cada foto: se calcula sola según cuántas haya
const introRotations = introImages.map((_, i) => -35 + i * 5)

const INTRO_VIDEO = 'https://hellorobosite.s3.us-east-2.amazonaws.com/Main+2.webm'

function IntroLoader({ onDone }) {
  const [phase, setPhase] = useState('stack')
  const [visibleCount, setVisibleCount] = useState(0)
  const onDoneRef = useRef(onDone)
  const videoRef = useRef(null)

  // onDone llega como función inline desde <App/>, así que se
  // guarda en un ref para que el effect de abajo NO se reinicie
  // cada vez que App vuelva a renderizar.
  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  // El video se monta junto con el loader (así va precargando
  // mientras caen las fotos) pero NO se reproduce solo: se
  // reinicia a 0s y arranca justo cuando el póster entra
  // en escena (fase 'logo').
  useEffect(() => {
    if (phase !== 'logo') return
    const video = videoRef.current
    if (!video) return
    try {
      video.currentTime = 0
    } catch {
      // aún sin metadata: el navegador encola el salto igual
    }
    video.play().catch(() => {})
  }, [phase])

  useEffect(() => {
    // Con movimiento reducido no se anima nada: se entrega el
    // Home directamente (el CSS además oculta el loader).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setTimeout(() => onDoneRef.current(), 300)
      return () => clearTimeout(t)
    }

    const timers = []

    // 1 · apilar las fotos una por una (todas se quedan)
    introImages.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), i * INTRO_FRAME_MS))
    })

    // 2 · póster con el logo completo
    const tLogo = introImages.length * INTRO_FRAME_MS + INTRO_STACK_TAIL_MS
    // 3 · el póster crece…
    const tGrow = tLogo + INTRO_LOGO_HOLD_MS
    //    …y el logo empieza a reducirse un poco antes de que termine
    const tIcon = tGrow + INTRO_ICON_LEAD_MS
    // 4 · fade final
    const tLeave = tIcon + INTRO_ICON_MS + INTRO_ICON_HOLD_MS
    const tDone = tLeave + INTRO_FADE_MS + 120

    timers.push(setTimeout(() => setPhase('logo'), tLogo))
    timers.push(setTimeout(() => setPhase('grow'), tGrow))
    timers.push(setTimeout(() => setPhase('icon'), tIcon))
    timers.push(setTimeout(() => setPhase('leave'), tLeave))
    timers.push(setTimeout(() => setPhase('done'), tDone))
    timers.push(setTimeout(() => onDoneRef.current(), tDone + 40))

    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  if (phase === 'done') return null

  const posterClass = [
    'intro-poster',
    phase !== 'stack' ? 'is-in' : '',
    phase === 'grow' || phase === 'icon' || phase === 'leave' ? 'is-full' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const brandClass = [
    'intro-brand',
    phase === 'logo' || phase === 'grow' ? 'is-logo' : '',
    phase === 'icon' || phase === 'leave' ? 'is-icon' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`intro-loader ${phase === 'leave' ? 'is-leaving' : ''}`}
      aria-hidden="true"
    >
      {/* 1 · Pila de fotos: cada una cae ENCIMA de la anterior
          y ninguna se quita — la imagen de atrás nunca desaparece */}
      <div className="intro-stack">
        {introImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`intro-photo ${i < visibleCount ? 'is-in' : ''}`}
            style={{ '--tilt': `${introRotations[i]}deg` }}
          />
        ))}
      </div>

      {/* 2/3 · Póster: entra como tarjeta sobre la pila, crece a
          pantalla completa y dentro vive la transición
          logo completo → icono (reutiliza <LogoWhite/> y <Icono/>) */}
      <div className={posterClass}>
        <div className="intro-circuit-bg" />

        <video
          ref={videoRef}
          className="intro-video"
          src={INTRO_VIDEO}
          muted
          loop
          playsInline
          preload="auto"
        />

        <div className={brandClass}>
          <LogoWhite />
          <Icono />
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   APP — NAVEGACIÓN SPA + CONTROL DEL LOADING
   ------------------------------------------------------------
   Estado del loading (por VISITA de la web, no por ruta):

     pendiente ──(primera llegada a Home de la visita)──► ejecutándose
        ▲                                                        │
        │                                                  onDone()│
        │                                                        ▼
        └────────── solo renace con NUEVA CARGA COMPLETA ──── completado
                   de la web (F5, pestaña nueva, etc.)

   Piezas:
   · introPlayedRef (ref) → bandera "el loading ya se ejecutó
     en esta visita". Se marca a true EN EL INSTANTE en que el
     loading se dispara, por eso es imposible ejecutarlo dos
     veces en la misma visita: ningún clic, back/forward,
     re-render ni effect puede volver a encenderlo, porque el
     único disparador verifica la bandera primero.
   · La bandera NO se guarda en sessionStorage/localStorage
     a propósito: vive en la memoria de la página, así que cada
     carga completa del navegador (F5 / Ctrl+R, cerrar y abrir
     pestaña, nueva visita) reinicia toda la app y el loading
     vuelve a quedar pendiente.
   · showIntro (estado) → encendido/apagado del loader. Solo se
     enciende en dos puntos: arranque de la app directamente en
     Home, o primera navegación (clic o back/forward) hacia "/"
     con la bandera en false. Todo lo demás solo lo apaga.
   · El loading NO está ligado a la ruta Home: Home es solo el
     lugar donde se muestra si todavía está pendiente.
   · Los <a href="/..."> existentes se interceptan y convierten
     en pushState (sin recargar). Back/forward vía popstate.
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

function PageRouter({ path, introDone }) {
  if (path === '/' || path === '') return <Home introDone={introDone} />

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

  /* Bandera "el loading YA se ejecutó en esta visita".
     Nace marcada si la web arranca directamente en Home (ahí el
     loading se dispara en el propio arranque); en cualquier otro
     arranque nace pendiente. NO se persiste en storage: vive en
     la memoria de la página, así que cada carga completa del
     navegador (F5, pestaña nueva, nueva visita) la reinicia. */
  const introPlayedRef = useRef(window.location.pathname === '/')

  // Encendido/apagado del loader. Solo puede nacer encendido si
  // la web arranca directamente en Home.
  const [showIntro, setShowIntro] = useState(
    () => window.location.pathname === '/'
  )
  const lastPath = useRef(window.location.pathname)

  /* Único punto que puede ENCENDER el loader durante la
     navegación: llegar a Home con el loading aún pendiente.
     La bandera se marca en el mismo instante en que se dispara
     (→ una sola vez por visita, bajo ninguna circunstancia más).
     Cualquier otra navegación solo lo apaga. Nada que dependa
     de renders llama aquí: solo los handlers de navegación. */
  const syncIntroWithRoute = useCallback((to) => {
    if (to === '/' && !introPlayedRef.current) {
      introPlayedRef.current = true // marcado AL dispararse
      setShowIntro(true)
    } else {
      setShowIntro(false)
    }
  }, [])

  const goTo = useCallback(
    (to) => {
      scrollTopInstant()

      // Mismo destino (ej. clic en el logo ya estando en Home):
      // no es una navegación nueva, no toca el loader.
      if (to === lastPath.current) return

      lastPath.current = to
      window.history.pushState({}, '', to)
      setPath(to)
      syncIntroWithRoute(to)
    },
    [syncIntroWithRoute]
  )

  useEffect(() => {
    // Evita que el navegador restaure scroll viejo con back/forward
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // back / forward del navegador (misma regla del loading)
    const onPopState = () => {
      const to = window.location.pathname
      scrollTopInstant()
      if (to === lastPath.current) return
      lastPath.current = to
      setPath(to)
      syncIntroWithRoute(to)
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

  // Mientras corre el intro no se puede hacer scroll detrás de él
  useEffect(() => {
    if (!showIntro) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [showIntro])

  return (
    <>
      {/* introDone: el tecleo del hero NO corre detrás del intro;
          arranca desde cero cuando showIntro pasa a false */}
      <PageRouter path={path} introDone={!showIntro} />
      {showIntro && <IntroLoader onDone={() => setShowIntro(false)} />}
    </>
  )
}

export default App