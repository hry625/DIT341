<template>
  <v-container v-on:scroll="onScroll" ref="chatlistContainer">
    <v-row>
      <v-col v-for="chat in chats" :key="chat.name" cols="12" sm="4">
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">{{
                chat.name
              }}</v-list-item-title>
              <v-list-item-subtitle v-if="chat.userCount != null"
                >{{ chat.userCount }} members have joined this
                chat.</v-list-item-subtitle
              >
              <v-list-item-subtitle v-else
                >Loading user count...</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn
              text
              @click="enterChat(chat)"
              v-if="!chat.isAlreadyJoined && chat.userCount != null"
              >Join</v-btn
            >
            <v-btn text disabled v-if="chat.isAlreadyJoined">Joined</v-btn>
          </v-card-actions>
        </v-card>
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
      loadedChats: [],
      loading: false
    }
  },
  mounted() {
    this.loadRecentChats()
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    chats() {
      return this.loadedChats
    }
  },
  methods: {
    loadRecentChats(lastKey) {
      const that = this
      Api.get('groups', { params: { page: 0, limit: 20 } })
        .catch((error) => {
          if (error.response) {
            alert(
              'Oh no something went wrong when loading the chats, Status code ' +
                error.response.status
            )
          } else {
            alert('Oops something went wrong when loading the chats')
          }
        })
        .then(function (res) {
          console.log(res)
          const resData = res.data
          for (const group in resData) {
            const chat = resData[group]
            chat.key = resData[group]._id
            // chat.name = group.name
            that.getUserCountForChat(chat)
            that.loadedChats.unshift(chat)
          }
        })
      // firebase
      //   .database()
      //   .ref('chats')
      //   .orderByKey()
      //   .limitToLast(20)
      //   .once('value', function (snapshot) {
      //     snapshot.forEach(function (childSnapshot) {
      //       const chat = childSnapshot.val()
      //       chat.key = childSnapshot.key
      //       that.getUserCountForChat(chat)
      //       that.loadedChats.unshift(chat)
      //     })
      //   })
    },
    loadRecentChatsByLastKey(lastKey) {
      const that = this
      that.loading = true
      firebase
        .database()
        .ref('chats')
        .orderByKey()
        .endAt(lastKey)
        .limitToLast(20)
        .once('value', function (snapshot) {
          const tempArray = []
          snapshot.forEach(function (item) {
            if (item.key !== lastKey) {
              const newChat = item.val()
              newChat.key = item.key
              tempArray.push(newChat)
            }
          })
          if (tempArray[0].key === tempArray[1].key) return
          tempArray.reverse()
          tempArray.forEach(function (child) {
            that.getUserCountForChat(child)
            that.loadedChats.push(child)
          })
          that.loading = false
        })
    },
    enterChat(group) {
      if (group.isAlreadyJoined || group.userCount == null) {
        return
      }
      console.log(group)
      const groupId = group.key
      const time = new Date().valueOf()
      const newGroup = {
        name: group.name,
        groupMember: [
          {
            username: this.$store.getters.user.username,
            userID: this.$store.getters.user.id,
            timestamp: time
          }
        ]
      }
      // TODO: udpate to post instead. add currentuser to /groups/:groupID/groupMember also need to modify the backend as well
      Api.put('/groups', newGroup)
        .catch((error) => {
          if (error.response) {
            alert(
              'Oh no something went wrong and couldnt enter group, Status code ' +
                error.response.status
            )
          } else {
            alert('Oops something went wrong')
          }
        })
        .then(() => {
          this.$router.push('/group/' + groupId)
        })
        .catch((error) => {
          if (error.response) {
            alert(
              'Oh no something went wrong, Status code ' + error.response.status
            )
          } else {
            alert('Oops something went wrong')
          }
        })
      // const updates = {}
      // updates['/chat_members/' + chatId + '/users/' + this.user.id] = {
      //   timestamp: time
      // }
      // updates['users/' + this.user.id + '/chats/' + chatId] = {
      //   timestamp: time
      // }
      //   const that = this
      // firebase
      //   .database()
      //   .ref()
      //   .update(updates)
      //   .then(() => {
      //     this.$router.push('/chat/' + chatId)
      //   })
    },
    onScroll() {
      if (
        window.top.scrollY + window.innerHeight >=
          document.body.scrollHeight - 100 &&
        !this.loading
      ) {
        this.loadRecentChatsByLastKey(
          this.loadedChats[this.loadedChats.length - 1].key
        )
      }
    },
    getUserCountForChat(chat) {
      const that = this
      that.$set(chat, 'userCount', chat.groupMember.length)
      chat.groupMember.forEach((user) => {
        if (user.userID === this.$store.getters.user.id) {
          that.$set(chat, 'isAlreadyJoined', true)
        }
      })
      // Api.get('groups').then(function (res) {
      //   console.log(chat)

      //   that.$set(chat, 'userCount', res.groupMember.length)
      // })

      // firebase
      //   .database()
      //   .ref('chat_members')
      //   .child(chat.key)
      //   .child('users')
      //   .once('value', function (snapshot) {
      //     that.$set(chat, 'userCount', snapshot.numChildren())
      //     snapshot.forEach((user) => {
      //       if (user.key === that.user.id) {
      //         that.$set(chat, 'isAlreadyJoined', true)
      //       }
      //     })
      //   })
    }
  },
  created() {
    window.addEventListener('scroll', this.onScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  },
  watch: {
    loadedChats: {
      deep: true,
      handler() {}
    }
  }
}
</script>
