/**
 * Add — user-authored recipes in the same structured format the app uses
 * internally (Golden Rule #4).
 *
 * The form is single-column and progressive:
 *   1. Basics — title, tagline, emoji, time, difficulty, servings
 *   2. Description (optional, collapsed by default)
 *   3. Ingredients — dynamic rows with amount / unit / name / prep note
 *   4. Steps — dynamic rows with title / content / stage note / why note
 *   5. Save — validates inline, saves to SQLite, pushes to recipe detail
 *
 * Why no source field?
 *   User-added recipes are exempt from attribution per the type schema.
 *   The app marks them user_added: true and renders "Your own recipe"
 *   in the detail header — honest about provenance.
 *
 * Why no categories field?
 *   User recipes appear in search and in the "Yours" filter chip.
 *   Category browse is only for the curated library — adding a
 *   multi-select taxonomy to this form would add friction for zero payoff.
 *
 * Ergonomics:
 *   - KeyboardAvoidingView keeps the save button visible when the keyboard
 *     opens — so the user never loses context.
 *   - Ingredient/step rows are compact but have 52dp minimum touch targets.
 *   - Add/remove buttons sit to the right — thumb-reach zone.
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

// ── Local form types ──────────────────────────────────────────────────────────

type IngForm = {
  key: string;
  name: string;
  amount: string;
  unit: string;
  prep: string;
  scales: 'linear' | 'fixed';
};

type StepForm = {
  key: string;
  title: string;
  content: string;
  stage_note: string;
  why_note: string;
};

type Difficulty = 'Easy' | 'Intermediate' | 'Involved';

const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

const blankIng = (): IngForm => ({
  key: uid(),
  name: '',
  amount: '',
  unit: '',
  prep: '',
  scales: 'linear',
});

const blankStep = (): StepForm => ({
  key: uid(),
  title: '',
  content: '',
  stage_note: '',
  why_note: '',
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function AddTab() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);

  // ── Basics state ───────────────────────────────────────────────────────────
  const [title,       setTitle]       = useState('');
  const [tagline,     setTagline]     = useState('');
  const [emoji,       setEmoji]       = useState('');
  const [description, setDescription] = useState('');
  const [timeMin,     setTimeMin]     = useState('');
  const [servings,    setServings]    = useState('2');
  const [difficulty,  setDifficulty]  = useState<Difficulty>('Easy');
  const [showDesc,    setShowDesc]    = useState(false);

  // ── Ingredients state ──────────────────────────────────────────────────────
  const [ings, setIngs] = useState<IngForm[]>([blankIng(), blankIng(), blankIng()]);

  const addIng = () => {
    Haptics.selectionAsync().catch(() => {});
    setIngs((prev) => [...prev, blankIng()]);
  };

  const removeIng = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIngs((prev) => prev.filter((i) => i.key !== key));
  };

  const updateIng = (key: string, field: keyof IngForm, value: string) => {
    setIngs((prev) =>
      prev.map((i) => (i.key === key ? { ...i, [field]: value } : i)),
    );
  };

  // ── Steps state ────────────────────────────────────────────────────────────
  const [steps, setSteps] = useState<StepForm[]>([blankStep(), blankStep()]);

  const addStep = () => {
    Haptics.selectionAsync().catch(() => {});
    setSteps((prev) => [...prev, blankStep()]);
  };

  const removeStep = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSteps((prev) => prev.filter((s) => s.key !== key));
  };

  const updateStep = (key: string, field: keyof StepForm, value: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)),
    );
  };

  // ── Validation + save ──────────────────────────────────────────────────────

  const validate = (): string | null => {
    if (!title.trim())     return 'Recipe needs a title.';
    if (!tagline.trim())   return 'Add a one-line description for the card.';
    const t = parseInt(timeMin, 10);
    if (isNaN(t) || t <= 0) return 'Time must be a whole number of minutes.';
    const sv = parseInt(servings, 10);
    if (isNaN(sv) || sv < 1 || sv > 20) return 'Servings must be between 1 and 20.';

    const validIngs = ings.filter((i) => i.name.trim());
    if (validIngs.length === 0) return 'Add at least one ingredient.';

    const validSteps = steps.filter((s) => s.title.trim() && s.content.trim());
    if (validSteps.length === 0) return 'Add at least one step with a title and instructions.';

    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Almost there', err);
      return;
    }

    const recipeId = 'user-' + uid();

    const ingredients: Ingredient[] = ings
      .filter((i) => i.name.trim())
      .map((i, idx) => ({
        id: `${recipeId}-ing-${idx}`,
        name: i.name.trim(),
        amount: parseFloat(i.amount) || 0,
        unit: i.unit.trim(),
        scales: i.scales,
        prep: i.prep.trim() || undefined,
      }));

    const methodSteps: Step[] = steps
      .filter((s) => s.title.trim() && s.content.trim())
      .map((s, idx) => ({
        id: `${recipeId}-step-${idx}`,
        title: s.title.trim(),
        content: s.content.trim(),
        stage_note: s.stage_note.trim() || undefined,
        why_note: s.why_note.trim() || undefined,
      }));

    const recipe: Recipe = {
      id: recipeId,
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim() || undefined,
      emoji: emoji.trim() || undefined,
      base_servings: parseInt(servings, 10),
      time_min: parseInt(timeMin, 10),
      difficulty,
      tags: [difficulty.toLowerCase()],
      user_added: true,
      generated_by_claude: false,
      ingredients,
      steps: methodSteps,
    };

    try {
      setSaving(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      await insertRecipe(db, recipe);
      // Navigate to the newly created recipe detail so the user can see it
      router.replace(`/recipe/${recipeId}`);
    } catch (e) {
      setSaving(false);
      Alert.alert('Save failed', String(e));
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
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
        {/* Header */}
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: tokens.paprika,
            marginBottom: 4,
          }}
        >
          Your recipe
        </Text>
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 34,
            lineHeight: 38,
            color: tokens.ink,
            marginBottom: 4,
          }}
        >
          Add a recipe
        </Text>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 13,
            color: tokens.muted,
            lineHeight: 18,
            marginBottom: 28,
          }}
        >
          Your own recipes use the same format as everything else — scaling,
          cook mode, and meal plans all work automatically.
        </Text>

        {/* ── Basics ───────────────────────────────────────────────────────── */}
        <SectionLabel>The basics</SectionLabel>

        <FieldLabel>Recipe name *</FieldLabel>
        <FormInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Mum's lamb roast"
          maxLength={80}
          autoCapitalize="words"
        />

        <FieldLabel style={{ marginTop: 14 }}>One-liner for the card *</FieldLabel>
        <FormInput
          value={tagline}
          onChangeText={setTagline}
          placeholder="e.g. Slow-roasted shoulder with lemon and rosemary"
          maxLength={120}
        />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          <View style={{ flex: 1 }}>
            <FieldLabel>Time (minutes) *</FieldLabel>
            <FormInput
              value={timeMin}
              onChangeText={setTimeMin}
              placeholder="45"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel>Servings *</FieldLabel>
            <FormInput
              value={servings}
              onChangeText={setServings}
              placeholder="2"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={{ width: 80 }}>
            <FieldLabel>Emoji</FieldLabel>
            <FormInput
              value={emoji}
              onChangeText={setEmoji}
              placeholder="🍽️"
              maxLength={2}
              style={{ textAlign: 'center', fontSize: 22 }}
            />
          </View>
        </View>

        {/* Difficulty */}
        <FieldLabel style={{ marginTop: 14 }}>Difficulty</FieldLabel>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['Easy', 'Intermediate', 'Involved'] as Difficulty[]).map((d) => (
            <Pressable
              key={d}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setDifficulty(d);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: difficulty === d }}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 10,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor:
                  difficulty === d
                    ? tokens.ink
                    : pressed
                      ? tokens.bgDeep
                      : tokens.cream,
                borderWidth: 1,
                borderColor: difficulty === d ? tokens.ink : tokens.line,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 12,
                  color: difficulty === d ? tokens.cream : tokens.inkSoft,
                }}
              >
                {d}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Optional description */}
        <Pressable
          onPress={() => setShowDesc((v) => !v)}
          style={{
            marginTop: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Icon
            name={showDesc ? 'arrow-down' : 'arrow-right'}
            size={12}
            color={tokens.muted}
          />
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 12,
              color: tokens.muted,
            }}
          >
            Add a note (optional)
          </Text>
        </Pressable>
        {showDesc && (
          <FormInput
            value={description}
            onChangeText={setDescription}
            placeholder="Any context — where the recipe comes from, what makes it special, things to watch out for."
            multiline
            numberOfLines={3}
            style={{ marginTop: 8, minHeight: 80, textAlignVertical: 'top' }}
          />
        )}

        {/* ── Ingredients ───────────────────────────────────────────────────── */}
        <SectionLabel style={{ marginTop: 32 }}>Ingredients</SectionLabel>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 12,
            color: tokens.muted,
            marginBottom: 12,
          }}
        >
          Leave amount at 0 for "to taste" or "as needed" items.
        </Text>

        <View style={{ gap: 10 }}>
          {ings.map((ing, idx) => (
            <IngredientRow
              key={ing.key}
              ing={ing}
              idx={idx}
              onChange={(field, val) => updateIng(ing.key, field, val)}
              onRemove={ings.length > 1 ? () => removeIng(ing.key) : undefined}
            />
          ))}
        </View>

        <Pressable
          onPress={addIng}
          accessibilityRole="button"
          accessibilityLabel="Add ingredient"
          style={({ pressed }) => ({
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: tokens.line,
            borderStyle: 'dashed',
            backgroundColor: pressed ? tokens.bgDeep : 'transparent',
          })}
        >
          <Icon name="plus" size={14} color={tokens.muted} />
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 13,
              color: tokens.muted,
            }}
          >
            Add ingredient
          </Text>
        </Pressable>

        {/* ── Steps ─────────────────────────────────────────────────────────── */}
        <SectionLabel style={{ marginTop: 32 }}>Method</SectionLabel>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 12,
            color: tokens.muted,
            marginBottom: 12,
          }}
        >
          One action per step. "Look for" cues (what done looks like) are optional
          but make cook mode much more useful.
        </Text>

        <View style={{ gap: 12 }}>
          {steps.map((step, idx) => (
            <StepRow
              key={step.key}
              step={step}
              idx={idx}
              onChange={(field, val) => updateStep(step.key, field, val)}
              onRemove={steps.length > 1 ? () => removeStep(step.key) : undefined}
            />
          ))}
        </View>

        <Pressable
          onPress={addStep}
          accessibilityRole="button"
          accessibilityLabel="Add step"
          style={({ pressed }) => ({
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: tokens.line,
            borderStyle: 'dashed',
            backgroundColor: pressed ? tokens.bgDeep : 'transparent',
          })}
        >
          <Icon name="plus" size={14} color={tokens.muted} />
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 13,
              color: tokens.muted,
            }}
          >
            Add step
          </Text>
        </Pressable>
      </ScrollView>

      {/* Sticky save CTA */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 14,
          backgroundColor: 'rgba(245,240,232,0.96)',
          borderTopWidth: 1,
          borderTopColor: tokens.line,
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
            backgroundColor: saving
              ? tokens.bgDeep
              : pressed
                ? tokens.paprikaDeep
                : tokens.paprika,
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
          <Text
            style={{
              fontFamily: fonts.sansXBold,
              fontSize: 14,
              color: saving ? tokens.muted : tokens.cream,
              letterSpacing: 0.3,
            }}
          >
            {saving ? 'Saving…' : 'Save recipe'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Ingredient row ────────────────────────────────────────────────────────────

function IngredientRow({
  ing,
  idx,
  onChange,
  onRemove,
}: {
  ing: IngForm;
  idx: number;
  onChange: (field: keyof IngForm, val: string) => void;
  onRemove?: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: tokens.cream,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.line,
        padding: 12,
        gap: 8,
      }}
    >
      {/* Row label + remove */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: tokens.muted,
          }}
        >
          Ingredient {idx + 1}
        </Text>
        {onRemove && (
          <Pressable
            onPress={onRemove}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Remove ingredient"
          >
            <Icon name="x" size={14} color={tokens.muted} />
          </Pressable>
        )}
      </View>

      {/* Amount + unit + name in one row */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <FormInput
          value={ing.amount}
          onChangeText={(v) => onChange('amount', v)}
          placeholder="0"
          keyboardType="decimal-pad"
          maxLength={6}
          style={{ width: 56 }}
        />
        <FormInput
          value={ing.unit}
          onChangeText={(v) => onChange('unit', v)}
          placeholder="g / ml / cups"
          style={{ width: 90 }}
        />
        <FormInput
          value={ing.name}
          onChangeText={(v) => onChange('name', v)}
          placeholder="Ingredient name"
          style={{ flex: 1 }}
          autoCapitalize="none"
        />
      </View>

      {/* Prep note */}
      <FormInput
        value={ing.prep}
        onChangeText={(v) => onChange('prep', v)}
        placeholder="Prep note (optional) — e.g. finely diced, room temp"
        style={{ fontSize: 12 }}
        autoCapitalize="none"
      />

      {/* Fixed toggle */}
      <Pressable
        onPress={() =>
          onChange('scales', ing.scales === 'linear' ? 'fixed' : 'linear')
        }
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          alignSelf: 'flex-start',
        }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: ing.scales === 'fixed' }}
        accessibilityLabel="Fixed quantity — doesn't scale with servings"
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: ing.scales === 'fixed' ? tokens.sage : tokens.line,
            backgroundColor: ing.scales === 'fixed' ? tokens.sage : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {ing.scales === 'fixed' ? (
            <Icon name="check" size={10} color={tokens.cream} />
          ) : null}
        </View>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 11,
            color: tokens.muted,
          }}
        >
          Fixed quantity (doesn't scale with servings)
        </Text>
      </Pressable>
    </View>
  );
}

// ── Step row ──────────────────────────────────────────────────────────────────

function StepRow({
  step,
  idx,
  onChange,
  onRemove,
}: {
  step: StepForm;
  idx: number;
  onChange: (field: keyof StepForm, val: string) => void;
  onRemove?: () => void;
}) {
  const [showOptional, setShowOptional] = useState(false);

  return (
    <View
      style={{
        backgroundColor: tokens.cream,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.line,
        padding: 12,
        gap: 8,
      }}
    >
      {/* Step label + remove */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: tokens.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 13,
                color: tokens.cream,
              }}
            >
              {idx + 1}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: tokens.muted,
            }}
          >
            Step {idx + 1}
          </Text>
        </View>
        {onRemove && (
          <Pressable
            onPress={onRemove}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Remove step"
          >
            <Icon name="x" size={14} color={tokens.muted} />
          </Pressable>
        )}
      </View>

      {/* Title */}
      <FormInput
        value={step.title}
        onChangeText={(v) => onChange('title', v)}
        placeholder="Step title — e.g. Sear the lamb"
        autoCapitalize="sentences"
      />

      {/* Content */}
      <FormInput
        value={step.content}
        onChangeText={(v) => onChange('content', v)}
        placeholder="Instructions — present tense. Get the pan ripping hot, then lay the chops down away from you."
        multiline
        numberOfLines={3}
        style={{ minHeight: 72, textAlignVertical: 'top' }}
        autoCapitalize="sentences"
      />

      {/* Optional fields toggle */}
      <Pressable
        onPress={() => setShowOptional((v) => !v)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          alignSelf: 'flex-start',
        }}
      >
        <Icon
          name={showOptional ? 'arrow-down' : 'arrow-right'}
          size={11}
          color={tokens.muted}
        />
        <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: tokens.muted }}>
          Add doneness cue + why-note
        </Text>
      </Pressable>

      {showOptional && (
        <>
          <FormInput
            value={step.stage_note}
            onChangeText={(v) => onChange('stage_note', v)}
            placeholder='"Look for" — what done looks like. e.g. Deep mahogany crust, pulling away from the edges.'
            multiline
            numberOfLines={2}
            style={{ minHeight: 60, textAlignVertical: 'top', fontSize: 12 }}
            autoCapitalize="sentences"
          />
          <FormInput
            value={step.why_note}
            onChangeText={(v) => onChange('why_note', v)}
            placeholder='Why this works — e.g. High heat denatures surface proteins fast, locking in moisture before the heat penetrates.'
            multiline
            numberOfLines={2}
            style={{ minHeight: 60, textAlignVertical: 'top', fontSize: 12 }}
            autoCapitalize="sentences"
          />
        </>
      )}
    </View>
  );
}

// ── Form primitives ───────────────────────────────────────────────────────────

function SectionLabel({
  children,
  style,
}: {
  children: string;
  style?: object;
}) {
  return (
    <Text
      style={[
        {
          fontFamily: fonts.display,
          fontSize: 22,
          color: tokens.ink,
          marginBottom: 6,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function FieldLabel({
  children,
  style,
}: {
  children: string;
  style?: object;
}) 