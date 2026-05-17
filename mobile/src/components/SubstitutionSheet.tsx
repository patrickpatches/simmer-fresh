/**
 * SubstitutionSheet — ingredient swap bottom sheet.
 *
 * Uses @gorhom/bottom-sheet BottomSheetModal for native-feel spring
 * animation and gesture dismissal (swipe down to close).
 *
 * Flow: ingredient tap → sheet opens → select a substitution row →
 *   confirm button appears → tap Confirm → onSwap(sub) fires → sheet closes.
 * "Back to original" row appears when a swap is already active (activeSwapName set).
 *
 * Requires BottomSheetModalProvider at the root layout (added in app/_layout.tsx).
 *
 * DECISION-015 quality pills (per Designer's v2 prototype,
 * docs/prototypes/substitution-sheet-v2.html):
 *   green  ✓  Great swap        — works as well or near-as-well
 *   yellow ≈  Some difference   — honest tradeoff
 *   red    ⚠  Noticeable change — works in a pinch, dish genuinely different
 *
 * Every pill carries colour + icon + text label. Never colour alone.
 * accessibilityLabel = "{pill label} — {substitution.changes}".
 *
 * Cook mode: pass inCookMode=true; sheet surfaces switch to cookMode tokens.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { tokens, fonts } from '../theme/tokens';
import type { Ingredient, Substitution } from '../data/types';
import { Icon } from './Icon';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SubstitutionSheetProps {
  ingredient: Ingredient | null;
  visible: boolean;
  /** Name of the currently swapped ingredient — drives "Back to original" row. */
  activeSwapName?: string;
  /** Pass true when recipe screen is in cook mode (switches surface tokens). */
  inCookMode?: boolean;
  /** Fires with the chosen substitution, or null to restore the original. */
  onSwap: (sub: Substitution | null) => void;
  onDismiss: () => void;
}

// ── Selection state ───────────────────────────────────────────────────────────

type Staged = Substitution | 'original' | null;

// ── Quality pill config (DECISION-015 v2 — green/yellow/red) ─────────────────

// Three semantic colours per Designer's v2 prototype. Each pill carries:
//   - colour (bg + border + text)
//   - icon (✓ / ≈ / ⚠)
//   - text label ("Great swap" / "Some difference" / "Noticeable change")
// Three signals on every pill — accessibility requires it. Never colour alone.

export interface PillConfig {
  /** Foreground colour (text + icon + border). */
  fg: string;
  /** Background tint at ~14% opacity. */
  bg: string;
  /** Border colour at ~40% opacity. */
  border: string;
  /** Glyph rendered to the left of the label. */
  icon: string;
  /** Human-readable label. */
  label: string;
}

export const PILL_CONFIG: Record<'green' | 'yellow' | 'red', PillConfig> = {
  green:  { fg: '#5DB870', bg: 'rgba(93,184,112,0.14)',  border: 'rgba(93,184,112,0.42)', icon: '✓', label: 'Great swap' },
  yellow: { fg: '#F2CC2A', bg: 'rgba(242,204,42,0.14)',  border: 'rgba(242,204,42,0.42)', icon: '≈', label: 'Some difference' },
  red:    { fg: '#D4663A', bg: 'rgba(212,102,58,0.14)',  border: 'rgba(212,102,58,0.40)', icon: '⚠', label: 'Noticeable change' },
};

function qualityConfig(quality: Substitution['quality']): PillConfig {
  return PILL_CONFIG[quality];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SubstitutionSheet({
  ingredient,
  visible,
  activeSwapName,
  inCookMode = false,
  onSwap,
  onDismiss,
}: SubstitutionSheetProps) {
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['82%'], []);
  const [staged, setStaged] = useState<Staged>(null);

  // Surface tokens differ in cook mode (OLED true-black surfaces).
  const surfaceBg = inCookMode ? tokens.cookMode.cardBg : tokens.cream;
  const divider   = inCookMode ? tokens.cookMode.lineDark : tokens.line;

  // Sync the visible prop to present / dismiss.
  // Note: calling dismiss() on an already-dismissed modal is a no-op in @gorhom/bottom-sheet.
  useEffect(() => {
    if (visible) {
      setStaged(null);
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [visible]);

  const handleSheetDismiss = useCallback(() => {
    setStaged(null);
    onDismiss();
  }, [onDismiss]);

  const handleConfirm = useCallback(() => {
    if (staged === null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    // Build #115 — single dismiss path. Previously this called
    // ref.current?.dismiss() directly which triggered @gorhom's onDismiss
    // callback which set parent visible=false which fired the useEffect
    // which called dismiss() AGAIN — two competing dismiss paths racing
    // against each other and producing odd post-dismiss re-open behaviour.
    // Now: fire onSwap (which the parent uses to ALSO setSheetVisible(false)
    // via the updated handleSwap). The useEffect on `visible` is the only
    // thing that calls ref.current?.dismiss(). One path, one direction.
    onSwap(staged === 'original' ? null : staged as Substitution);
  }, [staged, onSwap]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.55}
      />
    ),
    [],
  );

  if (!ingredient) return null;

  const subs = ingredient.substitutions ?? [];
  const hasActiveSwap = Boolean(activeSwapName) && activeSwapName !== ingredient.name;

  const confirmLabel =
    staged === 'original'
      ? `Restore ${ingredient.name}`
      : staged !== null
        ? `Swap to ${(staged as Substitution).ingredient}`
        : '';

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={handleSheetDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: surfaceBg }}
      handleIndicatorStyle={{
        backgroundColor: tokens.muted,
        width: 36,
        height: 4,
        borderRadius: 2,
      }}
      enablePanDownToClose
    >
      {/* ── Header ── */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 4,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: divider,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: tokens.primary,
              marginBottom: 6,
            }}
          >
            Swap ingredient
          </Text>
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 20,
              lineHeight: 24,
              color: tokens.ink,
            }}
            numberOfLines={2}
          >
            {ingredient.name}
          </Text>
          {hasActiveSwap && (
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 12,
                color: tokens.muted,
                marginTop: 3,
              }}
            >
              Currently using: {activeSwapName}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => onDismiss()}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: tokens.bgDeep,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}
        >
          <Icon name="x" size={15} color={tokens.ink} />
        </Pressable>
      </View>

      {/* ── Substitution rows ── */}
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
      >
        {/* Back to original row — only when a swap is currently active */}
        {hasActiveSwap && (
          <SubRow
            name={ingredient.name}
            description="Restore the original recipe ingredient."
            badge={{ label: 'Original', bg: tokens.line, text: tokens.inkSoft }}
            isStaged={staged === 'original'}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setStaged('original');
            }}
          />
        )}

        {/* Empty state */}
        {subs.length === 0 && !hasActiveSwap && (
          <View style={{ padding: 28, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 18,
                color: tokens.muted,
                marginBottom: 8,
              }}
            >
              No swaps on file yet
            </Text>
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: tokens.muted,
                textAlign: 'center',
                lineHeight: 19,
              }}
            >
              We haven't researched substitutions for this ingredient yet.
            </Text>
          </View>
        )}

        {subs.map((sub, idx) => {
          const badge = qualityConfig(sub.quality);
          const isStaged =
            staged !== null &&
            staged !== 'original' &&
            (staged as Substitution).ingredient === sub.ingredient;
          return (
            <SubRow
              key={idx}
              name={sub.ingredient}
              description={sub.changes}
              quantityNote={sub.quantity_note}
              hardToFindNote={
                sub.hard_to_find
                  ? (sub.local_alternative ?? 'May be hard to find in some areas.')
                  : undefined
              }
              badge={badge}
              isStaged={isStaged}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setStaged(sub);
              }}
            />
          );
        })}
      </BottomSheetScrollView>

      {/* ── Confirm button — visible only once a row is staged ── */}
      {staged !== null && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 24,
            borderTopWidth: 1,
            borderTopColor: divider,
          }}
        >
          <Pressable
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            android_ripple={{ color: tokens.primaryDeep, borderless: false }}
            style={{ borderRadius: 14 }}
          >
            <View style={{
              backgroundColor: tokens.primary,
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
            }}>
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 15,
                  color: tokens.onPrimary,
                  letterSpacing: 0.2,
                }}
              >
                {confirmLabel}
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </BottomSheetModal>
  );
}

// ── Single substitution row ───────────────────────────────────────────────────

function SubRow({
  name,
  description,
  quantityNote,
  hardToFindNote,
  badge,
  isStaged,
  onPress,
}: {
  name: string;
  description: string;
  quantityNote?: string;
  hardToFindNote?: string;
  /** v2 pill config OR legacy badge shape for the 'Original' row. */
  badge: PillConfig | { label: string; bg: string; text: string };
  isStaged: boolean;
  onPress: () => void;
}) {
  // Discriminate between the v2 pill (has fg/border/icon) and the legacy
  // 'Original' row badge (has just label/bg/text). Both render as small pills.
  const isV2 = 'icon' in badge && 'fg' in badge;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Select ${name}`}
      android_ripple={{ color: tokens.primaryLight, borderless: false }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 14,
        // Selected state: primaryLight bg + 3dp left border in primaryDeep
        backgroundColor: isStaged ? tokens.primaryLight : 'transparent',
        borderLeftWidth: isStaged ? 3 : 0,
        borderLeftColor: tokens.primaryDeep,
        gap: 14,
      }}>
      {/* Radio dot */}
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: isStaged ? tokens.primary : tokens.line,
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
          flexShrink: 0,
        }}
      >
        {isStaged && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: tokens.primary,
            }}
          />
        )}
      </View>

      {/* Text block */}
      <View style={{ flex: 1, gap: 4 }}>
        {/* Name + quality pill */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 14,
              color: tokens.ink,
              flexShrink: 1,
            }}
          >
            {name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: badge.bg,
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderWidth: isV2 ? 1 : 0,
              borderColor: isV2 ? (badge as PillConfig).border : 'transparent',
            }}
            accessible
            accessibilityLabel={isV2 ? `${(badge as PillConfig).label} — ${description}` : (badge as { label: string }).label}
          >
            {isV2 ? (
              <Text style={{ fontSize: 10, color: (badge as PillConfig).fg }}>{(badge as PillConfig).icon}</Text>
            ) : null}
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 10,
                color: isV2 ? (badge as PillConfig).fg : (badge as { text: string }).text,
                letterSpacing: 0.3,
              }}
            >
              {badge.label}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 13,
            lineHeight: 18,
            color: tokens.inkSoft,
          }}
        >
          {description}
        </Text>

        {/* Quantity note — italic, ochre */}
        {quantityNote && (
          <Text
            style={{
              fontFamily: fonts.displayItalic,
              fontStyle: 'italic',
              fontSize: 12,
              color: tokens.ochre,
              marginTop: 2,
            }}
          >
            {quantityNote}
          </Text>
        )}

        {/* Hard-to-find notice */}
        {hardToFindNote && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 6,
              marginTop: 4,
              backgroundColor: tokens.bgDeep,
              borderRadius: 8,
              padding: 8,
            }}
          >
            <Icon name="alert" size={12} color={tokens.ochre} />
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 12,
                lineHeight: 17,
                color: tokens.ochre,
                flex: 1,
              }}
            >
              {hardToFindNote}
            </Text>
          </View>
        )}
      </View>
      </View>
    </Pressable>
  );
}
