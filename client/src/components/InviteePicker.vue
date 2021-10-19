<template>
  <v-container fluid>
    <v-select
      v-model="selectedUsers"
      :items="users"
      label="Invitees"
      item-text="name"
      multiple
    >
      <template v-slot:prepend-item>
        <v-list-item ripple @click="toggle">
          <v-list-item-action>
            <v-icon :color="selectedUsers.length > 0 ? 'indigo darken-4' : ''">
              {{ icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Select All </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
      <template v-slot:append-item> </template>
    </v-select>
  </v-container>
</template>

<script>
import { Api } from '@/Api'
export default {
  data: () => ({
    users: [],
    selectedUsers: []
  }),
  mounted() {
    this.getUsers()
  },
  computed: {
    likesAllFruit() {
      return this.selectedUsers.length === this.users.length
    },
    likesSomeFruit() {
      return this.selectedUsers.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },

  methods: {
    getUsers() {
      // TODO: change to get group member
      var groupID = this.$store.getters.groupID
      var url = '/groups/' + groupID
      Api.get(url)
        .then((response) => {
          console.log(response.data)
          var membersList = response.data.groupMember
          for (const index in membersList) {
            this.users.push(membersList[index].username)
          }
          //   this.users = response.data
        })
        .catch((error) => {
          this.users = []
          console.log(error)
          //   TODO: display some error message instead of logging to console
        })
        .then(() => {
          console.log(this.users)
        })
    },
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.selectedUsers = []
        } else {
          this.selectedUsers = this.users.slice()
        }
        this.$store.commit('setSelectedUser', this.selectedUsers)
      })
    }
  }
}
</script>
