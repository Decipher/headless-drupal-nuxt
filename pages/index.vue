<template>
  <v-container grid-list-sm fluid>
    <v-layout align-center column>
      <v-flex xs12 sm8 md6>
        <v-card>
          <v-card-title class="headline">DEMO: Headless Blog</v-card-title>

          <v-card-text></v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn v-if="!accessToken" color="primary" flat @click="login">
              Log In
            </v-btn>
            <v-btn v-else color="primary" flat @click="logout">Log Out</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex xs12 sm8 md6>
        <v-card color="warning">
          <v-card-text>
            <ul>
              <li>Keep calm and clear the cache</li>
              <li>Log out and in again</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm8 md6>
        <v-card v-if="accessToken" xs12>
          <v-card-title class="headline">Add content</v-card-title>

          <v-card-text>
            <v-form>
              <component
                :is="field.type"
                v-for="field of schema"
                :key="field.id"
                v-model="input[field.id]"
                :field="field"
              />

              <v-btn @click="submit">Submit</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Deserializer, Serializer } from 'jsonapi-serializer'
import components from '~/components'

export default {
  components,

  data: () => ({
    // @TODO - Set default values.
    input: {},
    result: null
  }),

  computed: {
    accessToken() {
      return this.$store.state.oauth.accessToken
    },

    jsonapi() {
      const options = {
        attributes: Object.keys(this.schema)
      }

      return new Serializer('node--blog', options).serialize(this.input)
    },

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

      return sortedSchema
    }
  },

  async asyncData({ $axios, store }) {
    const data = {}
    const accessToken = store.state.oauth.accessToken

    // Ensure user is logged in.
    if (!accessToken) return data

    // Subrequests URL.
    const url = `http://${process.env.api_host}/subrequests?_format=json`

    // Subrequests headers.
    const headers = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${accessToken}`
    }

    // // Subrequests.
    // 1. Load 'Entity form display' by ID for layout information.
    // 2. Load 'Field config' entries by entity type and bundle for instance
    //    settings.
    // 3. Load 'Field storage config' entries by entity type for base
    //    configuration.

    // Note: This approach is only recommended for demonstration purposes, it
    //       may not work with more than 50 fields across multiple content
    //       types, and would not work with more than 50 fields in the Blog
    //       content type.

    const subrequests = [
      // Entity Form Display.
      // Requires the 'administer display modes' permission.
      {
        requestId: 'entity_form_display',
        uri:
          '/api/entity_form_display/entity_form_display?filter[drupal_internal__id]=node.blog.default',
        action: 'view',
        headers
      },
      // Field Config.
      // Requires the 'administer ENTITY fields' permission.
      {
        requestId: 'field_config',
        uri:
          '/api/field_config/field_config?filter[bundle]=blog&filter[entity_type]=node',
        action: 'view',
        headers
      },
      // Field storage config.
      {
        requestId: 'field_storage_config',
        uri:
          '/api/field_storage_config/field_storage_config?filter[entity_type]=node',
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
    login() {
      this.$login()
    },

    logout() {
      this.$logout()
    },

    async submit() {
      const url = `http://${process.env.api_host}/api/node/blog`

      const headers = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${this.accessToken}`
      }

      this.result = await this.$axios.post(url, this.jsonapi, { headers })
    }
  }
}
</script>
