import type { ConversationItemProps } from './ConversationItem.types'
import './ConversationItem.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong ConversationItem · Web · DOM `<button>` */
export function ConversationItem(props: ConversationItemProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-conversation-item',
        `ak-conversation-item--${variant}`,
        `ak-conversation-item--${size}`,
        fullWidth && 'ak-conversation-item--full-width',
        loading && 'ak-conversation-item--loading',
      )}
    >
      {iconLeft && <span className="ak-conversation-item__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-conversation-item__icon">{iconRight}</span>}
    </button>
  )
}

export default ConversationItem
