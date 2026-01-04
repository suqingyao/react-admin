<script lang="ts" setup>
import type { VbenFormSchema } from '@nova/common-ui';
import { z } from '@nova/common-ui';
import { $t } from '@nova/locales';
import type { Recordable } from '@nova/types';
import { computed, ref } from 'vue';

defineOptions({ name: 'ForgetPassword' });

const _loading = ref(false);

const _formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: 'example@example.com',
      },
      fieldName: 'email',
      label: $t('authentication.email'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.emailTip') })
        .email($t('authentication.emailValidErrorTip')),
    },
  ];
});

function _handleSubmit(value: Recordable<any>) {
  // eslint-disable-next-line no-console
  console.log('reset email:', value);
}
</script>

<template>
  <AuthenticationForgetPassword
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
