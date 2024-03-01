<script lang="ts" setup>
import { registerLicense } from '@syncfusion/ej2-base';
import { onMounted } from 'vue';

import {common } from 'src/app/entities';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWX5cdXRcRGZYUUR1XkE=');

onMounted( async() => {
  await common().init()
});
</script>
<template lang="pug">
  router-view
</template>
