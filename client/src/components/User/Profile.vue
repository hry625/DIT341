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
                    <img
                      alt="user"
                      src="http://www.reptilepage.com/assets/images/nophoto-female.jpg"
                    />
                  </v-avatar>

                  <v-spacer></v-spacer>

                  <v-menu offset-y left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" color="white" icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item href="#">
                        <v-list-item-title>Edit</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-app-bar>

                <v-card-title class="white--text mt-8">
                  <p class="ml-3">
                    {{ firstName + ' ' + lastName }}
                  </p>
                </v-card-title>
              </v-img>

              <v-card-text>
                <div class="font-weight-bold ml-8 mb-2">User Profile</div>
                <v-list two-line>
                  <v-list-item href="#">
                    <v-list-item-icon>
                      <v-icon color="indigo"> mdi-account </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        firstName + ' ' + lastName
                      }}</v-list-item-title>
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
                      <v-list-item-title>{{ email }}</v-list-item-title>
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
                      <v-list-item-title>{{ username }}</v-list-item-title>
                    </v-list-item-content>

                    <!-- <v-list-item-icon>
                      <v-icon>mdi-message-text</v-icon>
                    </v-list-item-icon> -->
                  </v-list-item>
                  <v-btn
                    v-on:click="Delete()"
                    class="rounded-0"
                    color="#000000"
                    x-large
                    block
                    dark
                    >Delete account</v-btn
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
  </v-app>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

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
      var user = this.$store.getters.user
      this.firstName = user.firstName
      this.lastName = user.lastName
      this.username = user.username
      this.email = user.email
    },
    Delete() {
      Api.delete('/deleteUser', { authorization: this.jwt })
        .then((response) => {
          this.$router.push({ name: 'auth' })
        })
        .catch((error) => {
          this.message = error
          if (error.response) {
            alert(
              'Oh no something went wrong when deleting user, Status code ' +
                error.response.status
            )
          } else {
            alert('Oops something went wrong when deleting user')
          }
        })
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
</style>
