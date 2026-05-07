/**
 * akong ConversationItem · React Native 实现
 *
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端 · `.tsx` 解析 Web 端
 * 用方 `import { ConversationItem } from '@akong/conversation-item'` 自动取对应平台
 */

import { Pressable, Text, View, Image, useColorScheme } from 'react-native'
import { tokens } from '@akong/tokens'
import type { ConversationItemProps } from './ConversationItem.types'
import { formatUnread } from './ConversationItem.behavior'

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

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const t = scheme === 'dark' ? tokens.dark : tokens.light

  const unreadText = formatUnread(unread)
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      accessibilityLabel={ariaLabel ?? `${name} ${lastMessage}`}
      accessibilityRole="button"
      style={({ pressed }: { pressed: boolean }) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: tokens.space[3],
        minHeight: 64,
        paddingVertical: tokens.space[3],
        paddingHorizontal: tokens.space[4],
        backgroundColor: t.bg,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {/* avatar */}
      <View style={{ position: 'relative', width: 48, height: 48 }}>
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: t.bgSubtle }}
          />
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: t.bgSubtle,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: t.fgMuted,
                fontSize: tokens.text.md,
                fontWeight: tokens.weight.semibold,
              }}
            >
              {initial}
            </Text>
          </View>
        )}
        {online && (
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#22c55e',
              borderWidth: 2,
              borderColor: t.bg,
            }}
          />
        )}
      </View>

      {/* body */}
      <View style={{ flex: 1, minWidth: 0, flexDirection: 'column', gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.space[1] }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: tokens.text.base,
              fontWeight: tokens.weight.semibold,
              color: t.fg,
            }}
          >
            {name}
          </Text>
          {pinned && (
            <Text style={{ fontSize: 12, color: t.fgMuted }} accessibilityLabel="pinned">
              📌
            </Text>
          )}
          {muted && (
            <Text style={{ fontSize: 12, color: t.fgMuted }} accessibilityLabel="muted">
              🔕
            </Text>
          )}
        </View>
        <Text
          numberOfLines={1}
          style={{
            fontSize: tokens.text.sm,
            color: muted ? t.fgMuted : t.fgSubtle,
          }}
        >
          {lastMessage}
        </Text>
      </View>

      {/* meta */}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4,
          marginLeft: tokens.space[2],
        }}
      >
        {time ? (
          <Text style={{ fontSize: tokens.text.xs, color: t.fgMuted }}>{time}</Text>
        ) : (
          // 占位 · 让 unread 跟有 time 时一致竖直位置
          <View style={{ height: tokens.text.xs * 1.4 }} />
        )}
        {unreadText !== null && (
          <View
            style={{
              minWidth: 18,
              height: 18,
              paddingHorizontal: 6,
              borderRadius: 9,
              backgroundColor: muted ? t.bgHover : t.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: tokens.text.xs,
                fontWeight: tokens.weight.semibold,
                color: muted ? t.fgMuted : t.accentFg,
                lineHeight: tokens.text.xs * 1.1,
              }}
            >
              {unreadText}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export default ConversationItem
