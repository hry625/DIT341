<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col sm="6" xs="12">
        <h5>Create a new chat</h5>
        <form @submit.prevent="createGroup">
          <v-col xs="12">
            <v-text-field
              name="groupname"
              label="Group Name"
              id="groupname"
              v-model="groupName"
              type="text"
              required
            ></v-text-field>
            <v-btn type="submit" depressed color="green" dark>Create</v-btn>
          </v-col>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase/compat/app'
import { Api } from '../../Api'
export default {
  data() {
    return {
      groupName: '',
      loading: false,
      groupID: ''
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    createGroup() {
      if (this.groupName === '' || this.loading) {
        return
      }
      this.loading = true
      const time = new Date().valueOf()
      var group = {
        name: this.groupName,
        groupMember: [
          {
            username: this.user.username,
            userID: this.user.id,
            timestamp: time
          }
        ]
      }
      Api.post('/groups', group).catch((error) => {
        if (error.response) {
          alert(
            'Oh no something went wrong when creating group, Status code ' + error.response.status
          )
        } else {
          alert('Oops something went wrong when creating group')
        }
      })
        .then((res) => {
          this.groupID = res.data._id
          console.log(res.data._id)
          console.log(res)
        })
        .then(() => {
          const groupInfo = {
            groupName: this.groupName,
            messageCount: 0
          }
          // use firebase to indicate this is a new message updated on certain group
          firebase
            .database()
            .ref()
            .child('group')
            .child(this.groupID)
            .set(groupInfo)

          this.loading = false
          this.$router.push('/group/' + this.groupID)
        })

      // const newPostKey = firebase.database().ref().child('groups').push().key
      // const updates = {}
      // updates['/groups/' + newPostKey] = { name: this.chatName }
      // updates['/group_members/' + newPostKey + '/users/' + this.user.id] = {
      //   timestamp: time
      // }
      // updates['users/' + this.user.id + '/groups/' + newPostKey] = {
      //   timestamp: time
      // }
      // firebase
      //   .database()
      //   .ref()
      //   .update(updates)
      //   .then(() => {
      //     this.loading = false
      //     this.$router.push('/group/' + newPostKey)
      //   })
    }
  }
}
</script>
