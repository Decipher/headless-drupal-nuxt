import { Deserializer, Serializer } from 'jsonapi-serializer'

/**
 * @mixin
 */
export default {
  computed: {
    accessToken() {
      return this.$store.state.oauth.accessToken
    },

    headers() {
      return {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${this.accessToken}`
      }
    }
  },

  methods: {
    async createNode() {
      const url = `http://${process.env.api_host}/api/node/blog`

      const headers = this.headers

      const options = {
        attributes: this.schema.keys
      }

      const jsonapi = new Serializer('node--blog', options).serialize(
        this.input
      )

      try {
        this.result = await this.$axios.post(url, jsonapi, { headers })

        const node = await new Deserializer({
          keyForAttribute: 'camelCase'
        }).deserialize(this.result.data)
        this.node__blog.unshift(node)
        this.dialog = false
      } catch (error) {
        this.result = error
        // eslint-disable-next-line
        console.log(error)
      }
    },

    async deleteNode(id) {
      const url = `http://${process.env.api_host}/api/node/blog/${id}`

      try {
        const headers = this.headers
        this.result = await this.$axios.delete(url, { headers })
      } catch (error) {
        this.result = error
        // eslint-disable-next-line
        console.log(error)
      }
    }
  }
}
