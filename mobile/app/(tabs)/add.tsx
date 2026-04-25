/**
 * Add — paste-and-parse recipe entry.
 *
 * Replaces the rigid 60-field form. The mental model now matches how
 * people actually have recipes: a block of text from a screenshot, a
 * friend's message, or a scrap of paper. We accept that, parse what we
 * can, and don't pretend to know what we don't.
 *
 * What we ASK for:
 *   - Name (single line)
 *   - Yield: "Serves N people" / "Makes N <unit>" / "Makes one (loaf/batch)"
 *   - Total time
 *   - Ingredients (one big text area, free format, one ingredient per line)
 *   - Method (one big text area, paragraphs or "1." / "2." numbered)
 *   - Optional emoji
 *
 * What we DO NOT ASK for:
 *   - Difficulty (subjective, produces noisy data — inferred from time + step
 *     count and shown faintly as "~Easy/Intermediate/Involved" in the
 *     detail view, but never required from the user)
 *   - Per-ingredient prep, scaling mode, fixed flag (advanced; sensible
 *     defaults applied; user can refine after save in a later session)
 *   - Stage notes / why notes per step (optional; can be added later when
 *     the user revisits a recipe)
 *
 * Parsing rules (kept generous — when in doubt, store verbatim):
 *   - Ingredient line: tries to extract leading amount + unit + remainder.
 *     "200g flour"           → { amount: 200, unit: 'g', name: 'flour' }
 *     "1 cup butter, soft"   → { amount: 1,   unit: 'cup', name: 'butter, soft' }
 *     "salt to taste"        → { amount: 0,   unit: '',  name: 'salt to taste' }
 *   - Method: split on blank lines OR leading "1." "2." numbered prefixes.
 *     Each block becomes a step. Title auto-derives from the first 5 words.
 *
 * Why this works psychologically:
 *   - Familiar mental model — "paste from where I had it" mirrors how
 *     other apps (Notes, Things, Google Keep) handle quick capture.
 *   - Low cognitive load — three big inputs, not 60 small ones.
 *   - Forgiving — a bad parse doesn't lose the recipe, it just stores the
 *     line verbatim. The user can fix it later.
 *   - Honest about scope — we don't make the user grade themselves.
 */
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';

import { tokens, fonts } from '../../src/theme/tokens';
import { Icon } from '../../src/components/Icon';
import { insertRecipe } from '../../db/database';
import type { Recipe, Ingredient, Step } from '../../src/data/types';

type YieldMode = 'serves' | 'makes' | 'one';

const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

// Infer difficulty from total time and step count — keeps the schema happy
// without making the user grade their own recipe.
function inferDifficulty(timeMin: number, stepCount: number): 'Easy' | 'Intermediate' | 'Involved' {
  if (timeMin <= 30 && stepCount <= 5) return 'Easy';
  if (timeMin >= 90 || stepCount >= 10) return 'Involved';
  return 'Intermediate';
}

// Parse a single ingredient line. Returns sensible structure even when
// the line doesn't match the standard pattern.
function parseIngredientLine(line: string, idx: number, recipeId: string): Ingredient {
  const trimmed = line.trim();
  // Match: leading number (allows decimals + fractions like 1/2), optional unit, remainder.
  const m = trimmed.match(/^(\d+(?:\.\d+)?(?:\s*\/\s*\d+)?)\s*([a-zA-Z]{1,5})?\s+(.+)$/);
  if (m) {
    const amountStr = m[1].replace(/\s+/g, '');
    let amount = 0;
    if (amountStr.includes('/')) {
      const [a, b] = amountStr.split('/').map(Number);
      amount = b ? a / b : a;
    } else {
      amount = parseFloat(amountStr);
    }
    return {
      id: `${recipeId}-ing-${idx}`,
      name: m[3].trim(),
      amount: isNaN(amount) ? 0 : amount,
      unit: (m[2] ?? '').trim(),
      scales: 'linear',
    };
  }
  // No match — store verbatim, no amount/unit. App will render as "salt to taste"-style.
  return {
    id: `${recipeId}-ing-${idx}`,
    name: trimmed,
    amount: 0,
    unit: '',
    scales: 'linear',
  };
}

// Split a method blob into steps. Handles:
//   - blank-line-separated paragraphs
//   - "1." / "2)" numbered lists
//   - lines that already start with a digit-and-punctuation
function parseMethod(text: string, recipeId: string): Step[] {
  const cleaned = text.trim();
  if (!cleaned) return [];

  // Numbered list detection — "1." or "1)" at the start of a line.
  const numbered = cleaned.split(/\n(?=\s*\d+[.\)]\s)/);
  let blocks: string[];
  if (numbered.length > 1) {
    blocks = numbered.map((b) => b.replace(/^\s*\d+[.\)]\s*/, '').trim());
  } else {
    // Fall back to blank-line split.
    blocks = cleaned.split(/\n\s*\n/).map((b) => b.trim());
  }
  blocks = blocks.filter((b) => b.length > 0);

  return blocks.map((content, idx) => {
    // Auto-title: first 5 words of the block, capitalised.
    const firstSentence = content.split(/[.!?]/)[0] ?? content;
    const titleWords = firstSentence.trim().split(/\s+/).slice(0, 5).join(' ');
    const title = titleWords.charAt(0).toUpperCase() + titleWords.slice(1);
    return {
      id: `${recipeId}-step-${idx}`,
      title: title || `Step ${idx + 1}`,
      content,
    };
  });
}

export default function AddTab() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);

  const [title,    setTitle]    = useState('');
  const [emoji,    setEmoji]    = useState('');
  const [timeMin,  setTimeMin]  = useState('');
  const [yieldMode, setYieldMode] = useState<YieldMode>('serves');
  const [yieldAmount, setYieldAmount] = useState('2');
  const [yieldUnit, setYieldUnit] = useState(''); // e.g. "tortillas", only for "makes" mode
  const [ingredientsText, setIngredientsText] = useState('');
  const [methodText, setMethodText] = useState('');

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert('Almost there', 'Recipe needs a name.');
    const t = parseInt(timeMin, 10);
    if (isNaN(t) || t <= 0) return Alert.alert('Almost there', 'Total time should be a number of minutes.');

    let baseServings = 2;
    let yieldUnitFinal: string | undefined;
    let fixedYield: boolean | undefined;
    if (yieldMode === 'one') {
      baseServings = 1;
      fixedYield = true;
    } else {
      const n = parseInt(yieldAmount, 10);
      if (isNaN(n) || n < 1) return Alert.alert('Almost there', 'Yield amount should be 1 or more.');
      baseServings = n;
      if (yieldMode === 'makes') {
        yieldUnitFinal = yieldUnit.trim() || 'pieces';
      }
    }

    const lines = ingredientsText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) return Alert.alert('Almost there', 'Add at least one ingredient.');

    const recipeId = 'user-' + uid();
    const ingredients = lines.map((l, i) => parseIngredientLine(l, i, recipeId));
    const methodSteps = parseMethod(methodText, recipeId);
    if (methodSteps.length === 0) return Alert.alert('Almost there', 'Add at least one step (a paragraph or numbered list).');

    const recipe: Recipe = {
      id: recipeId,
      title: title.trim(),
      tagline: title.trim(), // user-recipes use title as tagline; refinable later
      base_servings: baseServings,
      yield_unit: yieldUnitFinal,
      fixed_yield: fixedYield,
      time_min: t,
      difficulty: inferDifficulty(t, methodSteps.length),
      tags: [],
      user_added: true,
      generated_by_claude: false,
      emoji: emoji.trim() || undefined,
      ingredients,
      steps: methodSteps,
    };

    try {
      setSaving(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      await insertRecipe(db, recipe);
      router.replace(`/recipe/${recipeId}`);
    } catch (e) {
      setSaving(false);
      Alert.alert('Save failed', String(e));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingHorizontal: 20,
          paddingBottom: 160,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={kicker}>Your recipe</Text>
        <Text style={hero}>Add a recipe</Text>
        <Text style={lede}>
          Paste from anywhere — a screenshot, a message, a recipe card.
          We&apos;ll parse what we can. Two big text areas beat sixty form fields.
        </Text>

        {/* Name + emoji */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          <View style={{ flex: 1 }}>
            <Field>Recipe name</Field>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Mum's lamb roast"
              autoCapitalize="words"
              maxLength={80}
            />
          </View>
          <View style={{ width: 70 }}>
            <Field>Emoji</Field>
            <Input
              value={emoji}
              onChangeText={setEmoji}
              placeholder="🍽️"
              maxLength={2}
              style={{ textAlign: 'center', fontSize: 22 }}
            />
          </View>
        </View>

        {/* Yield mode */}
        <Field>How much does it make?</Field>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
          {(['serves', 'makes', 'one'] as YieldMode[]).map((m) => {
            const active = yieldMode === m;
            const label = m === 'serves' ? 'Serves people' : m === 'makes' ? 'Makes pieces' : 'Makes one';
            return (
              <Pressable
                key={m}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setYieldMode(m);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                  backgroundColor: active ? tokens.ink : pressed ? tokens.bgDeep : tokens.cream,
                  borderWidth: 1,
                  borderColor: active ? tokens.ink : tokens.line,
                })}
              >
                <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: active ? tokens.cream : tokens.inkSoft }}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Yield amount + unit (hidden in "one" mode) */}
        {yieldMode !== 'one' && (
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <View style={{ width: 90 }}>
              <Field>Amount</Field>
              <Input
                value={yieldAmount}
                onChangeText={setYieldAmount}
                placeholder={yieldMode === 'serves' ? '4' : '12'}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            {yieldMode === 'makes' && (
              <View style={{ flex: 1 }}>
                <Field>Unit (e.g. tortillas)</Field>
                <Input
                  value={yieldUnit}
                  onChangeText={setYieldUnit}
                  placeholder="tortillas, cookies, dumplings…"
                  autoCapitalize="none"
                  maxLength={30}
                />
              </View>
            )}
          </View>
        )}

        {/* Time */}
        <Field>Total time (minutes)</Field>
        <Input
          value={timeMin}
          onChangeText={setTimeMin}
          placeholder="45"
          keyboardType="number-pad"
          maxLength={4}
          style={{ marginBottom: 14, width: 120 }}
        />

        {/* Ingredients paste area */}
        <Field>Ingredients</Field>
        <Text style={hint}>
          One per line. We&apos;ll pull out amount, unit and name automatically.
          Anything we can&apos;t parse stays exactly as you wrote it.
        </Text>
        <Input
          value={ingredientsText}
          onChangeText={setIngredientsText}
          multiline
          placeholder={'200g flour\n2 eggs\n1 tsp salt\nblack pepper to taste'}
          style={{ minHeight: 140, textAlignVertical: 'top', fontSize: 14, lineHeight: 22 }}
          autoCapitalize="none"
        />

        {/* Method paste area */}
        <Field style={{ marginTop: 14 }}>Method</Field>
        <Text style={hint}>
          A blank line between paragraphs separates steps. &quot;1. … 2. …&quot; numbered lists also work.
        </Text>
        <Input
          value={methodText}
          onChangeText={setMethodText}
          multiline
          placeholder={'Mix the dry ingredients in a wide bowl.\n\nWhisk the eggs and milk together, then stir into the dry mix until just combined.\n\nRest 15 minutes before cooking.'}
          style={{ minHeight: 200, textAlignVertical: 'top', fontSize: 14, lineHeight: 22 }}
        />
      </ScrollView>

      {/* Sticky save */}
      <View
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          paddingHorizontal: 20, paddingTop: 12,
          paddingBottom: insets.bottom + 14,
          backgroundColor: 'rgba(245,240,232,0.96)',
          borderTopWidth: 1, borderTopColor: tokens.line,
        }}
      >
        <Pressable
          onPress={handleSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Save recipe"
          style={({ pressed }) => ({
            paddingVertical: 16,
            borderRadius: 18,
            backgroundColor: saving ? tokens.bgDeep : pressed ? tokens.paprikaDeep : tokens.paprika,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          })}
        >
          {saving ? (
            <ActivityIndicator color={tokens.cream} size="small" />
          ) : (
            <Icon name="chef" size={18} color={tokens.cream} />
          )}
          <Text style={{ fontFamily: fonts.sansXBold, fontSize: 14, color: saving ? tokens.muted : tokens.cream, letterSpacing: 0.3 }}>
            {saving ? 'Saving…' : 'Save recipe'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Compact form primitives ─────────────────────────────────────────────────

const kicker = { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' as const, color: tokens.paprika, marginBottom: 4 };
const hero   = { fontFamily: fonts.display, fontSize: 34, lineHeight: 38, color: tokens.ink, marginBottom: 4 };
const lede   = { fontFamily: fonts.sans, fontSize: 13, color: tokens.muted, lineHeight: 19, marginBottom: 24 };
const hint   = { fontFamily: fonts.sans, fontSize: 12, color: tokens.muted, lineHeight: 17, marginBottom: 8 };

function Field({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <Text
      style={[{
        fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1,
        textTransform: 'uppercase' as const, color: tokens.muted, marginBottom: 6,
      }, style]}
    >
      {children}
    </Text>
  );
}

function Input(props: React.ComponentProps<typeof TextInput> & { style?: object }) {
  const { style, ...rest } = props;
  return (
    <TextInput
      placeholderTextColor={tokens.muted}
      style={[{
        backgroundColor: tokens.bg, borderRadius: 12, borderWidth: 1, borderColor: tokens.line,
        paddingHorizontal: 14, paddingVertical: 12,
        fontFamily: fonts.sans, fontSize: 14, color: tokens.ink, minHeight: 46,
      }, style]}
      {...rest}
    />
  );
}
