/**
 * Add — user-authored recipes in the same structured format the app uses
 * internally (Rule #4).
 *
 * Placeholder. The form in the HTML prototype is a good starting shape but
 * needs to be re-scoped for mobile — the web form's multi-column layout has
 * to collapse to single-column with progressive disclosure on a phone.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens, fonts } from '../../src/theme/tokens';
import { Icon } from '../../src/components/Icon';

export default function AddTab() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.bg,
        paddingTop: insets.top + 40,
        paddingHorizontal: 24,
        paddingBottom: 140,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: tokens.paprika,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="plus" size={22} color={tokens.cream} />
      </View>
      <Text style={{ fontFamily: fonts.display, fontSize: 28, color: tokens.ink }}>
        Add a recipe
      </Text>
      <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: tokens.inkSoft, lineHeight: 20 }}>
        Your own recipes, in the same structured format the app uses for
        everything else — ingredients with scale types, steps with stage
        cues and why-notes. So they work with meal plans, scaling, and cook
        mode just like the seed recipes.
      </Text>
    </View>
  );
}
