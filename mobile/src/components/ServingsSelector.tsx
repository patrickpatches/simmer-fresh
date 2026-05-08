/**
 * ServingsSelector — controls how the ingredients list is scaled.
 *
 * v2 (2026-05-08, DECISION-014): per-recipe units. Replaces the generic
 * "How many people / Makes N portions" header with recipe-aware copy:
 * "Makes 4 burgers", "Makes 1 loaf", "Serves 4 people". The stepper still
 * adjusts the count; ingredient scaling math is unchanged. Recipe-aware
 * `extra_for_tomorrow_label` overrides the generic leftover-mode hint.
 *
 * Backwards-compatible: when `outputUnit` / `outputUnitPlural` are absent,
 * the component falls back to the legacy "people / portions" rendering.
 *
 * Stepper + leftover mode pills. Lives in the bottom half so thumbs
 * reach it one-handed. Haptic on every tap — confirms the action
 * without eyes needing to leave the pan.
 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { tokens, fonts } from '../theme/tokens';
import { Icon } from './Icon';
import {
  LEFTOVER_OPTIONS,
  leftoverById,
  totalPortionsFor,
  type LeftoverModeId,
} from '../data/scale';

type Props = {
  people: number;
  setPeople: (n: number) => void;
  leftoverKey: LeftoverModeId;
  setLeftoverKey: (k: LeftoverModeId) => void;
  baseServings: number;
  /** DECISION-014 per-recipe unit (singular). E.g. "burger", "serve". */
  outputUnit?: string;
  /** Plural form. Falls back to outputUnit + "s". */
  outputUnitPlural?: string;
  /** Recipe-aware label for the leftover-mode hint. */
  extraForTomorrowLabel?: string;
};

/**
 * Pluralise an output unit. Tries the explicit plural prop first, then a
 * naive append-"s" fallback. Patterns like "loaf -> loaves" require the
 * recipe to provide an explicit `output_unit_plural`.
 */
function pluralise(unit: string, plural: string | undefined, n: number): string {
  if (n === 1) return unit;
  if (plural) return plural;
  return unit + 's';
}

/**
 * Whether to use "Serves" or "Makes" as the prefix. Person-equivalent units
 * (the `serve` semantic the cook uses, plus the literal `person`) read as
 * "Serves 4". Item units (burger, tortilla, loaf, cup, etc.) read as "Makes 4".
 */
function isPersonUnit(unit: string | undefined): boolean {
  return unit === 'serve' || unit === 'person';
}

export function ServingsSelector({
  people,
  setPeople,
  leftoverKey,
  setLeftoverKey,
  baseServings,
  outputUnit,
  outputUnitPlural,
  extraForTomorrowLabel,
}: Props) {
  const option = leftoverById(leftoverKey);
  const totalPortions = totalPortionsFor(option, people, baseServings);
  const factor = totalPortions / baseServings;
  const scaledBadge =
    factor === 1
      ? 'At original proportions'
      : factor > 1
        ? `Scaled ${factor.toFixed(factor < 2 ? 1 : 0)}× up`
        : `Scaled ${factor.toFixed(1)}× down`;

  // DECISION-014: pick wording per recipe.
  const stepperCaption = outputUnit
    ? pluralise(outputUnit, outputUnitPlural, people)
    : people === 1 ? 'person' : 'people';
  const headerLabel = outputUnit
    ? `How many ${pluralise(outputUnit, outputUnitPlural, 2)}`
    : 'How many people';
  const makesPrefix = isPersonUnit(outputUnit) ? 'Serves' : 'Makes';
  const totalCaption = outputUnit
    ? pluralise(outputUnit, outputUnitPlural, totalPortions)
    : 'portions';

  const step = (delta: number) => {
    const next = Math.max(1, Math.min(20, people + delta));
    if (next !== people) {
      Haptics.selectionAsync().catch(() => {});
      setPeople(next);
    }
  };

  const pickMode = (id: LeftoverModeId) => {
    if (id === leftoverKey) return;
    Haptics.selectionAsync().catch(() => {});
    setLeftoverKey(id);
  };

  return (
    <View
      style={{
        backgroundColor: tokens.cream,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: tokens.lineDark,
        padding: 18,
        shadowColor: tokens.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: tokens.muted,
          }}
        >
          {headerLabel}
        </Text>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 11,
            color: factor === 1 ? tokens.sageDeep : tokens.primaryInk,
          }}
        >
          {scaledBadge}
        </Text>
      </View>

      {/* Stepper */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <StepperBtn dir="minus" disabled={people <= 1} onPress={() => step(-1)} />
        <View style={{ alignItems: 'center', minWidth: 80 }}>
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 44,
              lineHeight: 50,
              color: tokens.ink,
              fontVariant: ['tabular-nums'],
            }}
          >
            {people}
          </Text>
          <Text
            style={{
              fontFamily: fonts.sans,
              fontSize: 11,
              color: tokens.muted,
              marginTop: -2,
            }}
          >
            {stepperCaption}
          </Text>
        </View>
        <StepperBtn dir="plus" disabled={people >= 20} onPress={() => step(1)} />

        {/* Makes count */}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: tokens.muted,
            }}
          >
            {makesPrefix}
          </Text>
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 24,
              color: tokens.ink,
              fontVariant: ['tabular-nums'],
            }}
          >
            {totalPortions}
          </Text>
          <Text style={{ fontFamily: fonts.sans, fontSize: 10, color: tokens.muted }}>
            {totalCaption}
          </Text>
        </View>
      </View>

      {/* Mode pills */}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 18, flexWrap: 'wrap' }}>
        {LEFTOVER_OPTIONS.map((opt) => {
          const active = opt.id === leftoverKey;
          return (
            <Pressable
              key={opt.id}
              onPress={() => pickMode(opt.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={opt.label}
              style={{
                paddingHorizontal: 13,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: active ? tokens.primary : 'transparent',
                borderWidth: 2,
                borderColor: active ? tokens.primary : tokens.line,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 11,
                  color: active ? tokens.ink : tokens.inkSoft,
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Mode hint — recipe-aware when out of "tonight" mode and the recipe
          has its own extra_for_tomorrow_label authored. (DECISION-014.) */}
      <Text
        style={{
          fontFamily: fonts.sans,
          fontSize: 11,
          color: tokens.muted,
          marginTop: 10,
          lineHeight: 15,
        }}
      >
        {leftoverKey !== 'tonight' && extraForTomorrowLabel
          ? extraForTomorrowLabel
          : option.hint}
      </Text>
    </View>
  );
}

function StepperBtn({
  dir,
  onPress,
  disabled,
}: {
  dir: 'plus' | 'minus';
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={dir === 'plus' ? 'Add a person' : 'Remove a person'}
      hitSlop={8}
      android_ripple={{ color: tokens.primaryLight, borderless: false }}
      style={{ borderRadius: 23, opacity: disabled ? 0.4 : 1 }}
    >
      <View style={{
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled ? tokens.bgDeep : tokens.bg,
        borderWidth: 2,
        borderColor: disabled ? tokens.line : tokens.primary,
      }}>
        <Icon name={dir} size={18} color={disabled ? tokens.muted : tokens.primary} />
      </View>
    </Pressable>
  );
}
