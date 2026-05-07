/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * "给定 props · 期望行为"的纯描述 · 各端测试 import 这份 spec 跑 · 行为强一致
 */

/** unread 数字渲染逻辑 · Web 跟 RN 共用 */
export function formatUnread(unread: number | undefined): string | null {
  if (unread === undefined || unread <= 0) return null
  if (unread > 99) return '99+'
  return String(unread)
}

/** unread 是否仅渲染红点 (无数字 · 暂未启用 · 留扩展位) */
export function shouldRenderDotOnly(unread: number | undefined): boolean {
  // 当前 spec: ≥1 都渲染数字 · 红点单独渲染留给 future
  // 留这个函数是为了让契约清晰
  return unread === undefined ? false : false
}

export interface PressScenario {
  name: string
  /** 触发的事件类型 */
  event: 'press' | 'longPress'
  /** 期望哪个回调被触发 ('none' = 都不该触发) */
  expectFire: 'onPress' | 'onLongPress' | 'none'
}

/** 共享场景 · Web + RN 都跑 */
export const pressScenarios: PressScenario[] = [
  { name: 'tap · 触发 onPress', event: 'press', expectFire: 'onPress' },
  { name: 'long press · 触发 onLongPress', event: 'longPress', expectFire: 'onLongPress' },
]

/** unread 渲染场景 · 真值表 */
export const unreadScenarios: { input: number | undefined; expect: string | null }[] = [
  { input: undefined, expect: null },
  { input: 0, expect: null },
  { input: 1, expect: '1' },
  { input: 9, expect: '9' },
  { input: 99, expect: '99' },
  { input: 100, expect: '99+' },
  { input: 999, expect: '99+' },
]
