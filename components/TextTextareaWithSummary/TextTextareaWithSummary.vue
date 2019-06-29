<template>
  <div>
    <v-textarea
      v-model="input"
      :label="label"
      :name="field.id"
      :placeholder="field.placeholder"
      @input="update"
    />
  </div>
</template>

<script>
import field from '@/mixins/field.js'

export default {
  mixins: [field]
}
</script>
