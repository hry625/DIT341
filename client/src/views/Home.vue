<template>
  <div>
    <v-jumbotron
      header="DIT341 Frontend"
      lead="Welcome to your DIT341 Frontend Vue.js App"
    >
      <v-button class="btn_message" variant="primary" v-on:click="getMessage()"
        >Get Message from Server</v-button
      >
      <p>
        Message from the server:<br />
        {{ message }}
      </p>
    </v-jumbotron>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then((response) => {
          this.message = response.data.message
        })
        .catch((error) => {
          this.message = error
          if (error.response) {
            alert(
              'Oh no something went wrong, Status code ' +
                error.response.status
            )
          } else {
            alert('Oops something went wrong')
          }
        })
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
</style>
