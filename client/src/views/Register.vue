<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" dense>
          <v-col cols="12" sm="8" md="4" lg="4">
            <v-card elevation="0">
              <a href="https://edu-fedorae.netlify.app" name="Fedorae Education" title="Fedorae Education" target="_blank">
                <v-img src="@/assets/logo.png" alt="Fedorae Education Log" contain height="200"></v-img>
              </a>
              <v-card-text>
                <v-form>
                  <v-text-field label="Enter your first name"  v-model.trim="firstName" name="firstName" prepend-inner-icon="mdi-account" type="text" class="rounded-0" outlined></v-text-field>
                  <v-text-field label="Enter your last name"  v-model.trim="lastName" name="lastName" prepend-inner-icon="mdi-account" type="text" class="rounded-0" outlined></v-text-field>
                  <v-text-field label="Enter your username" v-model.trim="username" name="username" prepend-inner-icon="mdi-account" type="text" class="rounded-0" outlined></v-text-field>
                  <v-text-field label="Enter your email" v-model.trim="email" name="email" prepend-inner-icon="mdi-email" type="email" class="rounded-0" outlined></v-text-field>
                  <v-text-field label="Enter your password" v-model.trim="password" name="password" prepend-inner-icon="mdi-lock" type="password" class="rounded-0" outlined></v-text-field>
                  <v-btn class="rounded-0" v-on:click="Auth()"  color="#000000" x-large block dark>Register</v-btn>
                  <v-card-actions class="text--secondary">
                    <v-spacer></v-spacer>
                    <!-- <router-link :to="{ name: 'SignUp' }">Sign Up</router-link> -->
                    Already have an account? <router-link style="margin-right:30px" to="/auth">Log In</router-link>
                  </v-card-actions>
                </v-form>
              </v-card-text>
              <v-card-actions class="ml-6 mr-6 text-center">
                <!-- <p>By continuing, you agree to Fedorae Education's <a href="#" class="pl-2" style="color: #000000">Policy</a> and <a href="#" class="pl-2" style="color: #000000">Terms of Use</a></p> -->
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'Register',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    Auth() {
      Api.post('/register', { password: this.password, email: this.email, firstName: this.firstName, lastName: this.lastName, username: this.username })
        .then(response => {
          console.log(response.data)
          if (response.data.status === 'success') {
            this.$router.push({ name: 'auth' })
          }
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
