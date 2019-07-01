<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title>Headless blog demo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-if="!accessToken" color="primary" flat @click="login">
          Log In
        </v-btn>
        <v-btn v-else color="primary" flat @click="logout">Log Out</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer app class="pa-3">
      <span>&copy;<a href="https://realityloop.com">Realityloop</a> 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import api from '@/mixins/api'

export default {
  mixins: [api],

  methods: {
    login() {
      this.$login()
    },

    logout() {
      this.$logout()
    }
  }
}
</script>
