<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" dense>
          <v-col cols="12" sm="8" md="4" lg="4">
            <v-card elevation="0">
              <a
                href="https://edu-fedorae.netlify.app"
                name="Fedorae Education"
                title="Fedorae Education"
                target="_blank"
              >
                <v-img
                  src="@/assets/logo.png"
                  alt="Fedorae Education Log"
                  contain
                  height="200"
                ></v-img>
              </a>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Enter your email"
                    name="email"
                    v-model.trim="email"
                    prepend-inner-icon="mdi-email"
                    type="email"
                    class="rounded-0"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    label="Enter your password"
                    name="password"
                    v-model.trim="password"
                    prepend-inner-icon="mdi-lock"
                    type="password"
                    suffix="| Forgot?"
                    class="rounded-0"
                    outlined
                  ></v-text-field>
                  <v-btn
                    v-on:click="Login()"
                    class="rounded-0"
                    color="#000000"
                    x-large
                    block
                    dark
                    >Login</v-btn
                  >
                  <v-card-actions class="text--secondary">
                    <v-checkbox
                      color="#000000"
                      label="Remember me"
                    ></v-checkbox>
                    <v-spacer></v-spacer>
                    No account?
                    <router-link style="margin-right: 30px" to="/register"
                      >Sign Up</router-link
                    >
                    <!-- <a href="./Profile" class="pl-2" style="color: #000000">Sign Up</a> -->
                  </v-card-actions>
                </v-form>
              </v-card-text>
              <v-card-actions class="ml-6 mr-6 text-center">
                <!-- <p>
                  By continuing, you agree to Fedorae Education's
                  <a href="#" class="pl-2" style="color: #000000">Policy</a> and
                  <a href="#" class="pl-2" style="color: #000000"
                    >Terms of Use</a
                  >
                </p> -->
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
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    Login() {
      Api.post('/auth', { password: this.password, email: this.email })
        .then((response) => {
          console.log(response.data)
          if (response.data.data.JWT) {
            localStorage.setItem('jwt', response.data.data.JWT)
            this.$router.push({ name: 'calendar' })
          }
        })
        .catch((error) => {
          this.message = error
          if (error.response) {
            alert('Oh no failed to login, Status code ' + error.response.status)
          } else {
            alert('Oops something went wrong')
          }
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
