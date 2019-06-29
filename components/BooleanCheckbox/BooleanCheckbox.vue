<template>
  <div>
    <v-checkbox
      v-model="input"
      :label="label"
      :name="field.id"
      @click.native="update"
    />
  </div>
</template>

<script>
import field from '@/mixins/field.js'

export default {
  mixins: [field]
}
</script>
