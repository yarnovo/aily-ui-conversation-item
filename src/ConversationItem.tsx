import { useRef } from 'react'
import type { ConversationItemProps } from './ConversationItem.types'
import { formatUnread } from './ConversationItem.behavior'
import './ConversationItem.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

const LONG_PRESS_MS = 500

/** 简单 pin icon · 14×14 svg */
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M14 4l6 6-4 1-3 3v5l-2 2-3-3-4 4-1-1 4-4-3-3 2-2h5l3-3 1-4z" />
    </svg>
  )
}

/** 简单 mute icon (静音铃铛划掉) */
function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
      <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
      <path d="M18 8a6 6 0 0 0-9.33-5" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

/** akong ConversationItem · Web · DOM `<button>` */
export function ConversationItem(props: ConversationItemProps) {
  const {
    avatar,
    name,
    lastMessage,
    time,
    unread,
    pinned = false,
    muted = false,
    online = false,
    onPress,
    onLongPress,
    ariaLabel,
  } = props

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressFiredRef = useRef(false)

  const clearTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handlePointerDown = () => {
    longPressFiredRef.current = false
    if (!onLongPress) return
    clearTimer()
    longPressTimer.current = setTimeout(() => {
      longPressFiredRef.current = true
      onLongPress?.()
    }, LONG_PRESS_MS)
  }

  const handlePointerUp = () => {
    clearTimer()
  }

  const handlePointerLeave = () => {
    clearTimer()
  }

  const handleClick = () => {
    // long-press 已触发的场景下不再触发 onPress
    if (longPressFiredRef.current) {
      longPressFiredRef.current = false
      return
    }
    onPress?.()
  }

  const unreadText = formatUnread(unread)
  const initial = name.trim().charAt(0) || '?'

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? `${name} ${lastMessage}`}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className={cls(
        'ak-conversation-item',
        pinned && 'ak-conversation-item--pinned',
        muted && 'ak-conversation-item--muted',
        online && 'ak-conversation-item--online',
      )}
    >
      <span className="ak-conversation-item__avatar-wrap">
        {avatar ? (
          <img className="ak-conversation-item__avatar" src={avatar} alt="" />
        ) : (
          <span className="ak-conversation-item__avatar-fallback" aria-hidden="true">
            {initial}
          </span>
        )}
        {online && <span className="ak-conversation-item__online-dot" data-testid="online-dot" />}
      </span>

      <span className="ak-conversation-item__body">
        <span className="ak-conversation-item__row-top">
          <span className="ak-conversation-item__name">{name}</span>
          {pinned && (
            <span className="ak-conversation-item__pin" data-testid="pin-icon">
              <PinIcon />
            </span>
          )}
          {muted && (
            <span className="ak-conversation-item__mute" data-testid="mute-icon">
              <MuteIcon />
            </span>
          )}
        </span>
        <span className="ak-conversation-item__last-message">{lastMessage}</span>
      </span>

      <span
        className={cls(
          'ak-conversation-item__meta',
          !time && 'ak-conversation-item__meta--empty-time',
        )}
      >
        {time && <span className="ak-conversation-item__time">{time}</span>}
        {unreadText !== null && (
          <span className="ak-conversation-item__unread" data-testid="unread-badge">
            {unreadText}
          </span>
        )}
      </span>
    </button>
  )
}

export default ConversationItem
