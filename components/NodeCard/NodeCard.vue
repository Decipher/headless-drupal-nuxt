<template>
  <v-timeline-item>
    <template v-slot:opposite>
      <span>{{ node.created }}</span>
    </template>

    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
        <v-container>
          <v-card-title>
            <h2>{{ node.title }}</h2>
          </v-card-title>

          <v-card-text v-if="node.body">
            {{ node.body.value }}
          </v-card-text>
        </v-container>

        <v-btn
          v-if="hover"
          absolute
          bottom
          color="error"
          fab
          small
          right
          @click="$emit('delete')"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-card>
    </v-hover>
  </v-timeline-item>
</template>

<script>
import api from '@/mixins/api'

export default {
  mixins: [api],

  props: {
    node: {
      type: Object,
      required: true
    }
  },

  data: () => ({ fab: false })
}
</script>
