<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">DEMO: Headless Blog</v-card-title>

        <v-card-text></v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn v-if="!loggedIn" color="primary" flat @click="login">
            Log In
          </v-btn>
          <v-btn v-else color="primary" flat @click="logout">Log Out</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.state.oauth.accessToken
    }
  },

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
