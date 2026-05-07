/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * 覆盖:
 * - 渲染 (name / lastMessage / time / avatar / fallback)
 * - unread (undefined / 0 / 1 / 99 / 100 / 999)
 * - pinned / muted / online icon
 * - onPress / onLongPress (timer)
 * - truncate (长 name / 长 lastMessage)
 * - a11y (ariaLabel)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ConversationItem } from '../src/ConversationItem'
import { formatUnread, unreadScenarios } from '../src/ConversationItem.behavior'

describe('ConversationItem (Web) · 基础渲染', () => {
  it('渲染 name', () => {
    render(<ConversationItem name="张三" lastMessage="hi" />)
    expect(screen.getByText('张三')).toBeInTheDocument()
  })

  it('渲染 lastMessage', () => {
    render(<ConversationItem name="张三" lastMessage="今晚一起吃饭" />)
    expect(screen.getByText('今晚一起吃饭')).toBeInTheDocument()
  })

  it('渲染 time · 当传入', () => {
    render(<ConversationItem name="张三" lastMessage="hi" time="12:34" />)
    expect(screen.getByText('12:34')).toBeInTheDocument()
  })

  it('avatar 缺失时显示 name 首字 placeholder', () => {
    render(<ConversationItem name="李四" lastMessage="hi" />)
    expect(screen.getByText('李')).toBeInTheDocument()
  })

  it('avatar 传入时渲染 img', () => {
    const { container } = render(
      <ConversationItem name="张三" lastMessage="hi" avatar="https://x/a.jpg" />,
    )
    const img = container.querySelector('img.ak-conversation-item__avatar')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('src')).toBe('https://x/a.jpg')
  })
})

describe('ConversationItem (Web) · unread badge', () => {
  it('unread 0 不渲染 badge', () => {
    render(<ConversationItem name="张三" lastMessage="hi" unread={0} />)
    expect(screen.queryByTestId('unread-badge')).toBeNull()
  })

  it('unread undefined 不渲染 badge', () => {
    render(<ConversationItem name="张三" lastMessage="hi" />)
    expect(screen.queryByTestId('unread-badge')).toBeNull()
  })

  it('unread 1 显示 "1"', () => {
    render(<ConversationItem name="张三" lastMessage="hi" unread={1} />)
    expect(screen.getByTestId('unread-badge')).toHaveTextContent('1')
  })

  it('unread 99 显示 "99"', () => {
    render(<ConversationItem name="张三" lastMessage="hi" unread={99} />)
    expect(screen.getByTestId('unread-badge')).toHaveTextContent('99')
  })

  it('unread 100 显示 "99+"', () => {
    render(<ConversationItem name="张三" lastMessage="hi" unread={100} />)
    expect(screen.getByTestId('unread-badge')).toHaveTextContent('99+')
  })

  it('unread 999 显示 "99+"', () => {
    render(<ConversationItem name="张三" lastMessage="hi" unread={999} />)
    expect(screen.getByTestId('unread-badge')).toHaveTextContent('99+')
  })

  it('formatUnread 真值表 (跨端契约)', () => {
    for (const sc of unreadScenarios) {
      expect(formatUnread(sc.input)).toBe(sc.expect)
    }
  })
})

describe('ConversationItem (Web) · 状态 icon', () => {
  it('pinned 显示 pin icon', () => {
    render(<ConversationItem name="张三" lastMessage="hi" pinned />)
    expect(screen.getByTestId('pin-icon')).toBeInTheDocument()
  })

  it('pinned 缺省不显示 pin icon', () => {
    render(<ConversationItem name="张三" lastMessage="hi" />)
    expect(screen.queryByTestId('pin-icon')).toBeNull()
  })

  it('muted 显示 mute icon', () => {
    render(<ConversationItem name="张三" lastMessage="hi" muted />)
    expect(screen.getByTestId('mute-icon')).toBeInTheDocument()
  })

  it('muted 时根容器加 --muted class (lastMessage 灰)', () => {
    const { container } = render(<ConversationItem name="张三" lastMessage="hi" muted unread={5} />)
    expect(container.querySelector('.ak-conversation-item--muted')).toBeTruthy()
  })

  it('online 显示绿点', () => {
    render(<ConversationItem name="张三" lastMessage="hi" online />)
    expect(screen.getByTestId('online-dot')).toBeInTheDocument()
  })

  it('online 缺省不显示绿点', () => {
    render(<ConversationItem name="张三" lastMessage="hi" />)
    expect(screen.queryByTestId('online-dot')).toBeNull()
  })
})

describe('ConversationItem (Web) · 交互', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('onPress · click 触发', () => {
    const onPress = vi.fn()
    render(<ConversationItem name="张三" lastMessage="hi" onPress={onPress} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('onLongPress · pointerdown 持续 500ms 后触发', () => {
    const onLongPress = vi.fn()
    render(<ConversationItem name="张三" lastMessage="hi" onLongPress={onLongPress} />)
    const btn = screen.getByRole('button')
    fireEvent.pointerDown(btn)
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(onLongPress).toHaveBeenCalledOnce()
  })

  it('onLongPress · pointerdown 不到 500ms 释放不触发', () => {
    const onLongPress = vi.fn()
    const onPress = vi.fn()
    render(
      <ConversationItem
        name="张三"
        lastMessage="hi"
        onPress={onPress}
        onLongPress={onLongPress}
      />,
    )
    const btn = screen.getByRole('button')
    fireEvent.pointerDown(btn)
    act(() => {
      vi.advanceTimersByTime(200)
    })
    fireEvent.pointerUp(btn)
    fireEvent.click(btn)
    expect(onLongPress).not.toHaveBeenCalled()
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('onLongPress 触发后 click 不再触发 onPress', () => {
    const onLongPress = vi.fn()
    const onPress = vi.fn()
    render(
      <ConversationItem
        name="张三"
        lastMessage="hi"
        onPress={onPress}
        onLongPress={onLongPress}
      />,
    )
    const btn = screen.getByRole('button')
    fireEvent.pointerDown(btn)
    act(() => {
      vi.advanceTimersByTime(600)
    })
    fireEvent.pointerUp(btn)
    fireEvent.click(btn) // 长按抬起后浏览器仍会派发 click · 不应触发 onPress
    expect(onLongPress).toHaveBeenCalledOnce()
    expect(onPress).not.toHaveBeenCalled()
  })
})

describe('ConversationItem (Web) · 长内容 truncate', () => {
  it('长 name · DOM 仍单行 (CSS truncate · 检查 class 存在)', () => {
    const longName = '张'.repeat(50)
    const { container } = render(<ConversationItem name={longName} lastMessage="hi" />)
    const nameEl = container.querySelector('.ak-conversation-item__name')
    expect(nameEl).toBeTruthy()
    expect(nameEl?.textContent).toBe(longName)
  })

  it('长 lastMessage · DOM 仍单行 class 存在', () => {
    const longMsg = '哈'.repeat(200)
    const { container } = render(<ConversationItem name="张三" lastMessage={longMsg} />)
    const msgEl = container.querySelector('.ak-conversation-item__last-message')
    expect(msgEl).toBeTruthy()
    expect(msgEl?.textContent).toBe(longMsg)
  })
})

describe('ConversationItem (Web) · a11y', () => {
  it('默认 ariaLabel = name + lastMessage', () => {
    render(<ConversationItem name="张三" lastMessage="今晚见" />)
    expect(screen.getByRole('button', { name: '张三 今晚见' })).toBeInTheDocument()
  })

  it('自定义 ariaLabel 优先', () => {
    render(<ConversationItem name="张三" lastMessage="hi" ariaLabel="跟张三的会话 · 5 条未读" />)
    expect(screen.getByRole('button', { name: '跟张三的会话 · 5 条未读' })).toBeInTheDocument()
  })
})
