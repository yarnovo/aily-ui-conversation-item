# @akong/conversation-item

> ← 回 [akong design system](https://yarnovo.github.io/akong-core/) 总站

akong ConversationItem · 极简 · 跨端 (Web + React Native) · 类微信聊天列表项

## Demo

[GitHub Pages 演示](https://yarnovo.github.io/akong-conversation-item/)

## 安装

```bash
npm i github:yarnovo/akong-conversation-item github:yarnovo/akong-tokens
```

## Web

```tsx
import { ConversationItem } from '@akong/conversation-item'
import '@akong/conversation-item/style.css'
import '@akong/tokens/style.css'

<ConversationItem
  name="张三"
  lastMessage="今晚一起吃饭"
  time="12:34"
  unread={5}
  onPress={() => openChat('zhangsan')}
  onLongPress={() => showActionSheet('zhangsan')}
/>

<ConversationItem name="老婆" lastMessage="收到" pinned online avatar="https://..." />

<ConversationItem name="校友群" lastMessage="[图片]" muted unread={36} time="2 天前" />
```

## React Native

```tsx
import { ConversationItem } from '@akong/conversation-item'

<ConversationItem
  name="张三"
  lastMessage="今晚一起吃饭"
  time="12:34"
  unread={5}
  onPress={...}
  onLongPress={...}
/>
```

Metro bundler 自动按 `.native.tsx` 后缀解析 · 同 `import` 路径两端通用。

## API

| Prop | Type | Default | 说明 |
|---|---|---|---|
| name | string | — | **必填** · 会话名 (人 / 群) |
| lastMessage | string | — | **必填** · 最近一条消息 · 1 行 truncate |
| avatar | string | — | 头像 URL · 缺失时显示 name 首字 placeholder |
| time | string | — | 例 `刚刚` / `12:34` / `昨天` / `2 天前` |
| unread | number | 0 | 0 不渲染 · 1-99 数字 · >99 显示 `99+` |
| pinned | boolean | false | name 旁加 pin icon · 不改背景 (列表层负责排序 + 高亮) |
| muted | boolean | false | 显示静音 icon · lastMessage / unread 变灰 |
| online | boolean | false | 头像右下角 12×12 绿点 |
| onPress | () => void | — | 点击 / tap |
| onLongPress | () => void | — | 长按 (Web 500ms · RN 默认 500ms) |
| ariaLabel | string | `${name} ${lastMessage}` | a11y label |

## 设计原则

- **一份 props**：Web 跟 RN 共享 `ConversationItem.types.ts`
- **两端实现**：`ConversationItem.tsx` (Web · DOM `<button>` + pointer 长按 timer) + `ConversationItem.native.tsx` (RN · `<Pressable>` 自带 onLongPress)
- **触摸目标 ≥ 44pt**：min-height 64 · 全行可点
- **极简反馈**：active 0.7 opacity · hover 浅底色
- **token 100% 接 @akong/tokens**：颜色 / 间距 / 字号都走 var(--ak-*)
- **unread 真值表跨端一致**：`formatUnread()` Web/RN 共用

## 视觉规格

```
+----------------------------------------------------+
|  [avatar 48]      name      [pin][mute]    time    |
|     [+green]      lastMessage 1 行...     [unread] |
+----------------------------------------------------+
   16              flex-1                  16
```

- 整行 padding 12 16 · min-height 64
- avatar 48×48 circle · online 绿点 12×12 右下 (border 2px bg-color)
- name text-base · semibold · truncate
- lastMessage text-sm · text-fg-subtle · truncate · 1 行
- time text-xs · text-fg-muted
- unread 圆 18×18 · bg accent · text accentFg · `>99` 显示 `99+`
- muted: lastMessage + unread 颜色变 fg-muted
- active 0.7 opacity (跟 akong 全局触摸反馈一致)
