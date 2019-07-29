<template>
  <v-container grid-list-sm fluid>
    <v-layout align-center column>
      <!-- Blog. -->
      <v-timeline>
        <node-card
          v-for="node of node__blog"
          :key="node.id"
          :node="node"
          @delete="deleteItem(node.id)"
        />
      </v-timeline>
    </v-layout>

    <!-- Create dialog. -->
    <v-dialog v-if="accessToken" v-model="dialog">
      <template v-slot:activator="{ on }">
        <v-btn bottom color="primary" fixed fab large right small v-on="on">
          <v-icon>add</v-icon>
        </v-btn>
      </template>

      <v-card xs12>
        <v-card-title class="headline">Add content</v-card-title>

        <v-card-text>
          <v-form>
            <component
              :is="field.type.replace(/_/g, '-')"
              v-for="field of schema.fields"
              :key="field.id"
              v-model="input[field.id]"
              :field="field"
            />

            <v-btn @click="createNode">Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from '@/mixins/api'
import components from '@/components'

export default {
  components,

  mixins: [api],

  data: () => ({
    dialog: false,
    // @TODO - Set default values.
    input: {},
    result: null
  }),

  computed: {
    schema() {
      return this.$drupalJSONAPIEntities().node.blog
    }
  },

  methods: {
    deleteItem(id) {
      this.deleteNode(id)
      for (const delta in this.node__blog) {
        const node = this.node__blog[delta]
        if (node.id === id) this.node__blog.splice(delta, 1)
      }
    }
  }
}
</script>
