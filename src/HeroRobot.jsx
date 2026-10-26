/* =========================================================
   ROBOT ILUSTRADO DEL HERO
   ------------------------------------------------------------
   Robot de UPBot dibujado en SVG (cabeza inspirada en el logo:
   aro con antena y dos ojos). Las animaciones viven en App.css
   (sección 24): flota, parpadea, la antena brilla, saluda con
   el brazo y por los circuitos corre "corriente".
   Con movimiento reducido se queda quieto.
   ========================================================= */

export default function HeroRobot() {
  return (
    <figure className="hero-image hero-robot" aria-hidden="true">
      <svg viewBox="0 0 680 465" preserveAspectRatio="xMidYMid slice">
        <rect width="680" height="465" fill="#19223d" />

        {/* circuitos de fondo */}
        <g fill="none" stroke="#29385f" strokeWidth="2" strokeLinecap="round">
          <path d="M0 80 H120 L160 40 H260" />
          <path d="M0 370 H90 L130 410 H230" />
          <path d="M680 100 H560 L520 60 H430" />
          <path d="M680 330 H580 L540 370 H450" />
          <path d="M40 225 H110" />
          <path d="M570 225 H640" />
        </g>
        <g fill="none" stroke="#ffcf09" strokeWidth="2" strokeLinecap="round" opacity="0.55">
          <path className="robot-trace" d="M0 135 H80 L120 175 H170" />
          <path className="robot-trace" d="M680 275 H600 L560 235 H510" />
        </g>
        <g fill="#29385f">
          <circle cx="260" cy="40" r="4" />
          <circle cx="230" cy="410" r="4" />
          <circle cx="430" cy="60" r="4" />
          <circle cx="450" cy="370" r="4" />
        </g>
        <g fill="#ffcf09">
          <circle cx="170" cy="175" r="4" />
          <circle cx="510" cy="235" r="4" />
        </g>

        <ellipse className="robot-shadow" cx="340" cy="402" rx="90" ry="10" fill="#0d1221" />

        <g className="robot-body">
          {/* antena */}
          <line x1="340" y1="117" x2="340" y2="87" stroke="#ffcf09" strokeWidth="6" strokeLinecap="round" />
          <circle className="robot-antenna" cx="340" cy="79" r="11" fill="#ffcf09" />

          {/* cabeza: aro amarillo, pantalla azul y ojos */}
          <rect x="262" y="117" width="156" height="104" rx="52" fill="#ffcf09" />
          <rect x="282" y="137" width="116" height="64" rx="32" fill="#19223d" />
          <circle className="robot-eye" cx="316" cy="169" r="11" fill="#ffcf09" />
          <circle className="robot-eye" cx="364" cy="169" r="11" fill="#ffcf09" />

          {/* cuello y torso */}
          <rect x="326" y="221" width="28" height="14" rx="4" fill="#d9ad00" />
          <rect x="282" y="235" width="116" height="104" rx="24" fill="#ffcf09" />
          <rect x="304" y="257" width="72" height="40" rx="10" fill="#19223d" />
          <circle cx="322" cy="277" r="6" fill="#ffcf09" />
          <rect x="336" y="273" width="28" height="8" rx="4" fill="#29385f" />
          <rect x="306" y="309" width="68" height="8" rx="4" fill="#d9ad00" />

          {/* brazos (el derecho saluda) */}
          <rect x="238" y="251" width="44" height="18" rx="9" fill="#d9ad00" />
          <g className="robot-arm">
            <rect x="398" y="251" width="50" height="18" rx="9" fill="#d9ad00" />
            <circle cx="452" cy="260" r="13" fill="#ffcf09" />
          </g>

          {/* orugas */}
          <rect x="276" y="345" width="128" height="34" rx="17" fill="#29385f" />
          <g fill="#ffcf09">
            <circle cx="298" cy="362" r="10" />
            <circle cx="340" cy="362" r="10" />
            <circle cx="382" cy="362" r="10" />
          </g>
          <g fill="#19223d">
            <circle cx="298" cy="362" r="4" />
            <circle cx="340" cy="362" r="4" />
            <circle cx="382" cy="362" r="4" />
          </g>
        </g>
      </svg>
    </figure>
  )
}
