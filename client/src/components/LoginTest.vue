<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p class="lead mt-2">{{ authStatus }}</p>
    <div class="d-flex my-4 justify-content-center">
      <v-btn @click="signIn" class="btn btn-outline-primary mx-4">
        Sign In >
      </v-btn>
      <v-btn @click="sendRequest" class="btn btn-outline-success mx-4">
        Send Request >
      </v-btn>
      <v-btn @click="signOut" class="btn btn-outline-danger mx-4">
        Sign Out >
      </v-btn>
    </div>
    <p class="lead">{{ response }}</p>
  </div>
</template>

<script>
import { Api } from '@/Api'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

export default {
  name: 'HelloWorld',
  data: function () {
    return {
      response: 'No data yet...',
      authStatus: 'No Auth Status'
    }
  },
  props: {
    msg: String
  },
  methods: {
    sendRequest() {
      if (firebase.auth().currentUser) {
        firebase
          .auth()
          .currentUser.getIdToken(true)
          .then((idToken) => {
            Api({
              method: 'get',
              url: '/auth',
              headers: {
                AuthToken: idToken
              }
            })
              .then((res) => {
                this.response = res.data.message
              })
              .catch((error) => {
                this.response = error
              })
          })
          .catch((error) => {
            this.response = 'Error getting auth token' + error
          })
      } else {
        Api({
          method: 'get',
          url: '/auth'
        })
          .then((res) => {
            this.response = res.data.message
          })
          .catch((error) => {
            this.response = error
          })
      }
    },
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword('dummy@gmail.com', 'pass123!')
        .then(() => {
          this.authStatus = 'Authorized'
        })
        .catch((err) => {
          this.authStatus = err
        })
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.authStatus = 'Unauthorized'
        })
        .catch((err) => {
          this.authStatus = err
        })
    }
  }
}
</script>
