<template>
  <v-app>
    <v-main>
      <v-container align="center" justify="center" fill-height>
        <v-row class="bg-img" justify="space-around">
          <v-col cols="12" class="mt-8">
            <v-card width="400">
              <v-img height="200px" src="https://cdn.crispedge.com/f4893d.png">
                <v-app-bar class="mt-8" flat color="rgba(0, 0, 0, 0)">
                  <v-avatar size="100">
                    <img alt="user" src="https://picsum.photos/200/300" />
                  </v-avatar>

                  <v-spacer></v-spacer>

                  <!-- <v-menu offset-y left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" color="white" icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item href="#">
                        <v-list-item-title v-model="dialog" persistent
                          >Edit</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu> -->
                </v-app-bar>

                <v-card-title class="white--text mt-8">
                  <p class="ml-3">
                    {{ firstName + ' ' + lastName }}
                  </p>
                </v-card-title>
              </v-img>

              <!-- <v-file-input show-size label="File input" prepend-icon="mdi-myFileIcon" /> -->

              <v-card-text>
                <div class="font-weight-bold ml-8 mb-2">User Profile</div>
                <v-list two-line>
                  <v-list-item href="#">
                    <v-list-item-icon>
                      <v-icon color="indigo"> mdi-account </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <input v-model="firstName" />
                      <!-- <v-list-item-title>{{
                        firstName + ' ' + lastName
                      }}</v-list-item-title> -->
                    </v-list-item-content>
                    <!-- <v-list-item-icon>
                      <v-icon>mdi-message-text</v-icon>
                    </v-list-item-icon> -->
                  </v-list-item>

                  <v-divider inset></v-divider>

                  <v-list-item href="#">
                    <v-list-item-icon>
                      <v-icon color="indigo"> mdi-account </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <input v-model="lastName" />
                      <!-- <v-list-item-title>{{
                        firstName + ' ' + lastName
                      }}</v-list-item-title> -->
                    </v-list-item-content>
                    <!-- <v-list-item-icon>
                      <v-icon>mdi-message-text</v-icon>
                    </v-list-item-icon> -->
                  </v-list-item>

                  <v-divider inset></v-divider>

                  <v-list-item href="#">
                    <v-list-item-icon>
                      <v-icon color="indigo"> mdi-email </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <input v-model="email" />
                      <!-- <v-list-item-title>{{ email }}</v-list-item-title> -->
                    </v-list-item-content>

                    <!-- <v-list-item-icon>
                      <v-icon>mdi-message-text</v-icon>
                    </v-list-item-icon> -->
                  </v-list-item>

                  <v-divider inset></v-divider>

                  <v-list-item href="#">
                    <v-list-item-icon>
                      <v-icon color="indigo"> mdi-account </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <input v-model="username" />
                      <!-- <v-list-item-title>{{ username }}</v-list-item-title> -->
                    </v-list-item-content>

                    <!-- <v-list-item-icon>
                      <v-icon>mdi-message-text</v-icon>
                    </v-list-item-icon> -->
                  </v-list-item>
                  <v-btn @click="Delete()" class="user-button" color="red"
                    >Delete account</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn @click="editUser" class="user-button" color="green"
                    >Edit account</v-btn
                  >

                  <!-- <v-list-item href="#">
                    <v-list-item-icon>
                      <v-icon color="indigo">
                        mdi-map-marker
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Fedorae Education</v-list-item-title>
                      <v-list-item-subtitle>Online</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item> -->
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- <edit-profile :email="this.email"></edit-profile> -->
  </v-app>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
// import EditProfile from './EditProfile.vue'

export default {
  name: 'Profile',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      message: ''
    }
  },
  methods: {
    getUserData() {
      // const user = {
      //   firstName: 'Name',
      //   lastName: 'LastName',
      //   username: 'username',
      //   email: 'email'
      // }
      const user = this.$store.getters.user
      this.firstName = user.firstName
      this.lastName = user.lastName
      this.username = user.username
      this.email = user.email
    },
    Delete() {
      firebase.auth().onAuthStateChanged((user) => {
        Api.delete(`/users/${this.email}`, { authorization: this.jwt })
          .then((response) => {
            if (user) user.delete()
            firebase
              .auth()
              .signOut()
              .then(() => {
                // User deleted.
                this.$router.push({ path: 'login' })
                // Sign-out successful.
              })
          })
          .catch((error) => {
            this.message = error
          })
      })
    },
    editUser() {
      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email
      }
      this.$store.dispatch('editUser', user)
    }
  },
  // to check if user authorized
  beforeMount() {
    this.getUserData()
  }
}
</script>

<style>
.bg-img {
  background-image: url('https://bergen.edu/wp-content/uploads/Academic-Calendar-header.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
  border-radius: 3px;
}
input {
  padding: 10px;
}
input:focus-visible {
  counter-reset: blue;
}
.user-button {
  margin-top: 10px;
  margin-left: 10px;
}
</style>
