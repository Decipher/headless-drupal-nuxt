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
              v-for="field of $drupalJSONAPIEntities().node.blog.fields"
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
import { Deserializer } from 'jsonapi-serializer'

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

  async asyncData({ $axios, store }) {
    const data = {}

    // Subrequests URL.
    const url = `http://${process.env.api_host}/subrequests?_format=json`

    // Subrequests headers.
    const headers = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    }

    // Load all Blog nodes.
    const subrequests = [
      {
        requestId: 'node__blog',
        uri: '/api/node/blog?sort=-created',
        action: 'view',
        headers
      }
    ]

    const result = await $axios.post(url, subrequests, { headers })

    for (const id in result.data) {
      // Parse the JSON response.
      const jsonData = JSON.parse(result.data[id].body)

      // Deserialize the data.
      data[id] = await new Deserializer({
        keyForAttribute: 'camelCase'
      }).deserialize(jsonData)
    }

    return data
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
