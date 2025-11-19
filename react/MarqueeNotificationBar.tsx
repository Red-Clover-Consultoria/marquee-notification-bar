import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import './MarqueeNotificationBar.css'

const CSS_HANDLES = [
  'marqueeContainer',
  'marqueeWrapper',
  'marqueeContent',
  'marqueeMessage',
  'marqueeText',
  'marqueeIcon',
  'marqueeSeparator'
] as const

type IconPosition = 'left' | 'right'
type Speed = 'slow' | 'normal' | 'fast'
type FontSize = '12px' | '14px' | '16px' | '18px'

interface Message {
  text: string
  icon?: string
  iconPosition?: IconPosition
}

interface MarqueeNotificationBarProps {
  messages?: Message[]
  separator?: string
  backgroundColor?: string
  textColor?: string
  fontSize?: FontSize
  speed?: Speed
  pauseOnHover?: boolean
  showMarquee?: boolean
}

const MarqueeNotificationBarContainer = ({
  messages = [],
  separator = '•',
  backgroundColor = '#f5f5f5',
  textColor = '#333333',
  fontSize = '14px',
  speed = 'normal',
  pauseOnHover = true,
  showMarquee = true
}: MarqueeNotificationBarProps): JSX.Element | null => {
  const { handles } = useCssHandles(CSS_HANDLES)

  // Determinar la duración de la animación según la velocidad
  const getAnimationDuration = (): string => {
    switch (speed) {
      case 'slow':
        return '40s'
      case 'normal':
        return '25s'
      case 'fast':
        return '15s'
      default:
        return '25s'
    }
  }

  // Renderizar el icono si existe
  const renderIcon = (icon?: string): JSX.Element | null => {
    if (!icon) return null

    // Si es un emoji o texto simple
    if (icon.length <= 3 || !icon.includes('http')) {
      return <span className={handles.marqueeIcon}>{icon}</span>
    }

    // Si es una URL de imagen/SVG
    return (
      <img
        src={icon}
        alt="notification icon"
        className={handles.marqueeIcon}
      />
    )
  }

  // Renderizar un mensaje individual
  const renderMessage = (message: Message, index: number): JSX.Element => {
    const { text, icon, iconPosition = 'left' } = message

    return (
      <span key={index} className={handles.marqueeMessage}>
        {iconPosition === 'left' && renderIcon(icon)}
        <span className={handles.marqueeText}>{text}</span>
        {iconPosition === 'right' && renderIcon(icon)}
      </span>
    )
  }

  // Crear el contenido completo con todos los mensajes
  const contentElement = (
    <>
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <React.Fragment key={index}>
            {renderMessage(message, index)}
            {index < messages.length - 1 && separator && (
              <span className={handles.marqueeSeparator}>{separator}</span>
            )}
          </React.Fragment>
        ))
      ) : null}
    </>
  )

  // No renderizar nada si no hay mensajes
  if (!messages || messages.length === 0) {
    return null
  }

  const animationDuration = getAnimationDuration()

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (pauseOnHover) {
      const contents = e.currentTarget.querySelectorAll<HTMLElement>(`.${handles.marqueeContent}`)
      contents.forEach(content => {
        content.style.animationPlayState = 'paused'
      })
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (pauseOnHover) {
      const contents = e.currentTarget.querySelectorAll<HTMLElement>(`.${handles.marqueeContent}`)
      contents.forEach(content => {
        content.style.animationPlayState = 'running'
      })
    }
  }

  return (
    <div
      className={handles.marqueeContainer}
      style={{
        backgroundColor,
        color: textColor,
        fontSize
      }}
    >
      {showMarquee ? (
        <div
          className={handles.marqueeWrapper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={handles.marqueeContent}
            style={{
              animationDuration
            }}
          >
            {contentElement}
          </div>
          <div
            className={handles.marqueeContent}
            style={{
              animationDuration
            }}
            aria-hidden="true"
          >
            {contentElement}
          </div>
        </div>
      ) : (
        <div className={handles.marqueeWrapper}>
          <div className={handles.marqueeContent} style={{ animation: 'none' }}>
            {contentElement}
          </div>
        </div>
      )}
    </div>
  )
}

MarqueeNotificationBarContainer.schema = {
  title: 'Barra de Notificación Marquee',
  description: 'Barra de notificación con múltiples mensajes y animación marquee',
  type: 'object',
  properties: {
    messages: {
      title: 'Mensajes',
      description: 'Lista de mensajes a mostrar en la barra',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: {
            title: 'Texto del mensaje',
            description: 'El contenido del mensaje',
            type: 'string',
            default: ''
          },
          icon: {
            title: 'Icono o Emoji',
            description: 'URL de imagen/SVG o emoji (ej: 🎉, 🔥, ⭐)',
            type: 'string',
            default: ''
          },
          iconPosition: {
            title: 'Posición del icono',
            description: 'Posición del icono respecto al texto',
            type: 'string',
            enum: ['left', 'right'],
            enumNames: ['Izquierda', 'Derecha'],
            default: 'left'
          }
        }
      },
      default: [
        {
          text: '3 CUOTAS SIN INTERÉS desde $60.000',
          icon: '🎉',
          iconPosition: 'left'
        }
      ]
    },
    separator: {
      title: 'Separador entre mensajes',
      description: 'Carácter o símbolo para separar mensajes (ej: •, |, -, etc)',
      type: 'string',
      default: '•'
    },
    backgroundColor: {
      title: 'Color de fondo',
      description: 'Color de fondo en formato hexadecimal (ej: #f5f5f5)',
      type: 'string',
      default: '#f5f5f5',
      widget: {
        'ui:widget': 'color'
      }
    },
    textColor: {
      title: 'Color del texto',
      description: 'Color del texto en formato hexadecimal (ej: #333333)',
      type: 'string',
      default: '#333333',
      widget: {
        'ui:widget': 'color'
      }
    },
    fontSize: {
      title: 'Tamaño de fuente',
      description: 'Tamaño del texto (ej: 14px, 16px)',
      type: 'string',
      enum: ['12px', '14px', '16px', '18px'],
      enumNames: ['Pequeño (12px)', 'Mediano (14px)', 'Grande (16px)', 'Extra Grande (18px)'],
      default: '14px'
    },
    speed: {
      title: 'Velocidad de animación',
      description: 'Velocidad del desplazamiento marquee',
      type: 'string',
      enum: ['slow', 'normal', 'fast'],
      enumNames: ['Lenta', 'Normal', 'Rápida'],
      default: 'normal'
    },
    pauseOnHover: {
      title: 'Pausar al pasar el mouse',
      description: 'Detener animación cuando el usuario pase el mouse sobre la barra',
      type: 'boolean',
      default: true
    },
    showMarquee: {
      title: 'Activar animación marquee',
      description: 'Si está desactivado, el texto se mostrará centrado sin animación',
      type: 'boolean',
      default: true
    }
  }
}

export default MarqueeNotificationBarContainer
