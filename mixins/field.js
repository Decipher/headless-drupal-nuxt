/**
 * @mixin
 */
export default {
  computed: {
    label() {
      return this.field.label ? this.field.label : this.field.id
    }
  },

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      input: ''
    }
  },

  methods: {
    update() {
      this.$emit('input', this.input)
    }
  }
}
