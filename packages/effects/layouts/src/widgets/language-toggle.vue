<script setup lang="ts">
import type { SupportedLanguagesType } from '@nova/locales';

import { SUPPORT_LANGUAGES } from '@nova/constants';
import { Languages } from '@nova/icons';
import { loadLocaleMessages } from '@nova/locales';
import { preferences, updatePreferences } from '@nova/preferences';

import { VbenDropdownRadioMenu, VbenIconButton } from '@nova-core/shadcn-ui';

defineOptions({
  name: 'LanguageToggle',
});

async function handleUpdate(value: string | undefined) {
  if (!value) return;
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  await loadLocaleMessages(locale);
}
</script>

<template>
  <div>
    <VbenDropdownRadioMenu
      :menus="SUPPORT_LANGUAGES"
      :model-value="preferences.app.locale"
      @update:model-value="handleUpdate"
    >
      <VbenIconButton class="hover:animate-[shrink_0.3s_ease-in-out]">
        <Languages class="text-foreground size-4" />
      </VbenIconButton>
    </VbenDropdownRadioMenu>
  </div>
</template>
