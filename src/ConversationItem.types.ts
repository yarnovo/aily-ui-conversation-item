/**
 * akong ConversationItem · 跨端 props
 *
 * 类微信聊天列表 / iMessage 列表项 · 一份 props · Web + RN 共用
 */

export interface ConversationItemProps {
  /** 头像 URL · 缺失时显示 name 首字符 placeholder */
  avatar?: string
  /** 会话名 · 必填 (人名 / 群名) */
  name: string
  /** 最近一条消息预览 · 1 行 truncate */
  lastMessage: string
  /** 时间戳显示 · 例: '刚刚' / '12:34' / '昨天' / '2 天前' */
  time?: string
  /** 未读数 · 0 不渲染 · 1-99 显示数字 · >99 显示 '99+' */
  unread?: number
  /** 置顶 · name 旁加 pin icon · 不改背景 (列表层负责排序 + 背景) */
  pinned?: boolean
  /** 静音 · 显示静音 icon · unread badge 变灰 */
  muted?: boolean
  /** 在线 · 头像右下角 12×12 绿点 (border 2px white) */
  online?: boolean
  /** 点击 · Web onClick · RN onPress · 都传也行 */
  onPress?: () => void
  /** 长按 · Web pointerdown 500ms · RN onLongPress */
  onLongPress?: () => void
  /** a11y label · 默认 `${name} ${lastMessage}` */
  ariaLabel?: string
}
