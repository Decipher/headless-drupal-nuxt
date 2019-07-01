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
              :is="field.type"
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

  computed: {
    /**
     * The processed Field schema.
     *
     * @returns {Array}
     */
    schema() {
      const schema = {}

      // Ensure user is logged in.
      if (!this.accessToken) return schema

      // Ensure required data is available.
      if (!this.entity_form_display || !this.field_config) return schema

      // Process the Entity form display to start building the schema.
      // Assumes only one region: content.
      for (const fieldName in this.entity_form_display[0].content) {
        const entityFormDisplay = this.entity_form_display[0].content[fieldName]

        schema[fieldName] = {
          id: fieldName,
          settings: entityFormDisplay.settings,
          type: entityFormDisplay.type.replace(/_/g, '-'),
          weight: entityFormDisplay.weight,
          entityFormDisplay
        }
      }

      for (const fieldConfig of this.field_config) {
        // Skip field if not in the Entity form display.
        if (typeof schema[fieldConfig.fieldName] === 'undefined') continue

        schema[fieldConfig.fieldName] = Object.assign(
          schema[fieldConfig.fieldName],
          {
            label: fieldConfig.label,
            description: fieldConfig.description,
            required: fieldConfig.required,
            fieldConfig
          }
        )
      }

      for (const fieldStorageConfig of this.field_storage_config) {
        // Skip field if not in the Entity form display.
        if (typeof schema[fieldStorageConfig.fieldName] === 'undefined')
          continue

        schema[fieldStorageConfig.fieldName] = Object.assign(
          schema[fieldStorageConfig.fieldName],
          {
            cardinality: fieldStorageConfig.cardinality,
            fieldStorageConfig
          }
        )
      }

      // Sort the schema.
      const sortedSchema = []
      for (const field in schema) {
        sortedSchema.push(schema[field])
      }
      sortedSchema.sort((a, b) => {
        return a.weight - b.weight
      })

      return { fields: sortedSchema, keys: Object.keys(schema) }
    }
  },

  /**
   * Seeds the component with all required API data.
   *
   * @param $axios
   * @param store
   * @returns {Promise<void>}
   */
  async asyncData({ $axios, store }) {
    const data = {}
    const accessToken = store.state.oauth.accessToken

    // Subrequests URL.
    const url = `http://${process.env.api_host}/subrequests?_format=json`

    // Subrequests headers.
    const headers = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    }

    // Anonymous subrequests.
    // 1. Load all Blog nodes.
    const subrequests = [
      {
        requestId: 'node__blog',
        uri: '/api/node/blog?sort=-created',
        action: 'view',
        headers
      }
    ]

    // Load field schema information if user is authenticated.
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`

      // Field schema subrequests.
      // 1. Load 'Entity form display' by ID for layout information.
      // 2. Load 'Field config' entries by entity type and bundle for instance
      //    settings.
      // 3. Load 'Field storage config' entries by entity type for base
      //    configuration.

      // Note: This approach is only recommended for demonstration purposes, it
      //       may not work with more than 50 fields across multiple content
      //       types, and would not work with more than 50 fields in the Blog
      //       content type.

      // Entity Form Display.
      // Requires the 'administer display modes' permission.
      subrequests.push({
        requestId: 'entity_form_display',
        uri:
          '/api/entity_form_display/entity_form_display?filter[drupal_internal__id]=node.blog.default',
        action: 'view',
        headers
      })

      // Field Config.
      // Requires the 'administer ENTITY fields' permission.
      subrequests.push({
        requestId: 'field_config',
        uri:
          '/api/field_config/field_config?filter[bundle]=blog&filter[entity_type]=node',
        action: 'view',
        headers
      })

      // Field storage config.
      subrequests.push({
        requestId: 'field_storage_config',
        uri:
          '/api/field_storage_config/field_storage_config?filter[entity_type]=node',
        action: 'view',
        headers
      })
    }

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
