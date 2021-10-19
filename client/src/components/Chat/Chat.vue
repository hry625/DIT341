<template>
  <v-container fluid style="padding: 0">
    <v-row no-gutters>
      <v-col sm="5" class="scrollable">
        <group-calendar></group-calendar>
      </v-col>
      <v-col sm="2" class="scrollable">
        <chats></chats>
      </v-col>
      <v-col sm="5" style="position: relative">
        <div class="chat-container" v-on:scroll="onScroll" ref="chatContainer">
          <message :messages="messages" @imageLoad="scrollToEnd"></message>
        </div>
        <emoji-picker
          :show="emojiPanel"
          @close="toggleEmojiPanel"
          @click="addEmojiToMessage"
        ></emoji-picker>
        <div class="typer">
          <input
            type="text"
            placeholder="Type here..."
            v-on:keyup.enter="sendMessage"
            v-model="content"
          />
          <v-btn icon class="blue--text emoji-panel" @click="toggleEmojiPanel">
            <v-icon>mdi-emoticon-outline</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Message from './parts/Message.vue'
import EmojiPicker from './parts/EmojiPicker.vue'
import Chats from './parts/Chats.vue'
import Calendar from '../Calendar.vue'
import firebase from 'firebase/compat/app'
import { Api } from '../../Api'
export default {
  data() {
    return {
      content: '',
      chatMessages: [],
      emojiPanel: false,
      messageRef: {},
      calendarRef: {},
      loading: false,
      totalChatHeight: 0
    }
  },
  props: ['id'],
  mounted() {
    this.loadChat()
    this.$store.commit('setGroupID', this.id)
    this.$store.dispatch('loadGroupUser')
    this.$store.dispatch('loadOnlineUsers')
  },
  components: {
    message: Message,
    'emoji-picker': EmojiPicker,
    chats: Chats,
    groupCalendar: Calendar
  },
  computed: {
    messages() {
      return this.chatMessages
    },
    username() {
      return this.$store.getters.user.username
    },
    onNewMessageAdded() {
      const that = this
      const onNewMessageAdded = function (snapshot, newMessage = true) {
        var groupkey = snapshot.ref.parent.key
        /*eslint-disable */
        var urlPattern =
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
        /* eslint-enable */
        var url = '/messages/' + groupkey
        Api.get(url)
          .then(function (res) {
            var msgs = []
            msgs = res.data[0].messages
            that.chatMessages = []
            for (const index in msgs) {
              const message = {}
              message.key = msgs[index]._id
              message.content = msgs[index].content
              message.content = message.content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
              message.content = message.content.replace(
                urlPattern,
                "<a href='$1'>$1</a>"
              )
              message.user = msgs[index].username
              message.timestamp = msgs[index].timestamp
              console.log('in the for loop')
              if (!newMessage) {
                that.chatMessages.push(that.processMessage(message))
                that.scrollToEnd()
              } else {
                that.chatMessages.unshift(that.processMessage(message))
                that.scrollTo()
              }
            }
          })
          .catch((error) => {
            if (error.response) {
              alert(
                'Oh no something went wrong, Status code ' +
                  error.response.status
              )
            } else {
              alert('Oops something went wrong')
            }
          })
        // const onNewMessageAdded = function (snapshot, newMessage = true) {
        //   const message = snapshot.val()
        //   message.key = snapshot.key
        //   /*eslint-disable */
        //   var urlPattern =
        //     /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
        //   /* eslint-enable */
        //   message.content = message.content
        //     .replace(/&/g, '&amp;')
        //     .replace(/</g, '&lt;')
        //     .replace(/>/g, '&gt;')
        //     .replace(/"/g, '&quot;')
        //     .replace(/'/g, '&#039;')
        //   message.content = message.content.replace(
        //     urlPattern,
        //     "<a href='$1'>$1</a>"
        //   )
        //   if (!newMessage) {
        //     that.chatMessages.unshift(that.processMessage(message))
        //     that.scrollTo()
        //   } else {
        //     that.chatMessages.push(that.processMessage(message))
        //     that.scrollToEnd()
        //   }
      }
      console.log('second')
      console.log(that.chatMessages)

      return onNewMessageAdded
    }
  },
  watch: {
    '$route.params.id'(newId, oldId) {
      this.messageRef.off('value', this.onNewMessageAdded)
      this.loadChat()
      this.$store.commit('setGroupID', this.id)
    }
  },
  updat: {},
  methods: {
    loadChat() {
      this.totalChatHeight = this.$refs.chatContainer.scrollHeight
      this.loading = false
      if (this.id !== undefined) {
        this.chatMessages = []
        const groupID = this.id
        this.messageRef = firebase
          .database()
          .ref('group')
          .child(groupID)
          .child('messageCount')
        this.messageRef.on('value', this.onNewMessageAdded)
      }
    },
    onScroll() {
      // const scrollValue = this.$refs.chatContainer.scrollTop
      // const that = this
      // if (scrollValue < 100 && !this.loading) {
      //   this.totalChatHeight = this.$refs.chatContainer.scrollHeight
      //   this.loading = true
      //   const chatID = this.id
      //   const currentTopMessage = this.chatMessages[0]
      //   if (currentTopMessage === undefined) {
      //     this.loading = false
      //     return
      //   }
      // firebase
      //   .database()
      //   .ref('messages')
      //   .child(chatID)
      //   .child('messages')
      //   .orderByKey()
      //   .endAt(currentTopMessage.key)
      //   .limitToLast(20)
      //   .once('value')
      //   .then(function (snapshot) {
      //     const tempArray = []
      //     snapshot.forEach(function (item) {
      //       tempArray.push(item)
      //     })
      //     if (tempArray[0].key === tempArray[1].key) return
      //     tempArray.reverse()
      //     tempArray.forEach(function (child) {
      //       // that.onNewMessageAdded(child, false)
      //     })
      //     that.loading = false
      //   })
      // }
    },
    processMessage(message) {
      /*eslint-disable */
      var imageRegex = /([^\s\']+).(?:jpg|jpeg|gif|png)/i
      /* eslint-enable */
      if (imageRegex.test(message.content)) {
        message.image = imageRegex.exec(message.content)[0]
      }
      const emojiRegex =
        /([\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{2934}-\u{1f18e}])/gu
      if (emojiRegex.test(message.content)) {
        message.content = message.content.replace(
          emojiRegex,
          '<span class="emoji">$1</span>'
        )
      }
      return message
    },
    sendMessage() {
      if (this.content !== '') {
        console.log(this.id)
        console.log(this.username)
        this.$store.dispatch('sendMessage', {
          username: this.username,
          content: this.content,
          date: new Date().toString(),
          groupID: this.id
        })
        this.content = ''
      }
    },
    scrollToEnd() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.chat-container')
        container.scrollTop = container.scrollHeight
      })
    },
    ste: function () {
      var container = this.$el.querySelector('.chat-container')
      container.scrollTop = container.scrollHeight
    },
    scrollTo() {
      // this.$nextTick(() => {
      //   const currentHeight = this.$refs.chatContainer.scrollHeight
      //   const difference = currentHeight - this.totalChatHeight
      //   const container = this.$el.querySelector('.chat-container')
      //   container.scrollTop = difference
      // })
    },
    addEmojiToMessage(emoji) {
      this.content += emoji.value
    },
    toggleEmojiPanel() {
      this.emojiPanel = !this.emojiPanel
    }
  }
}
</script>

<style>
.scrollable {
  overflow-y: auto;
  height: 90vh;
}
.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.2);
}
.typer input[type='text'] {
  position: absolute;
  left: 2.5rem;
  padding: 1rem;
  width: 80%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
}
.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}
.message {
  margin-bottom: 3px;
}
.message.own {
  text-align: right;
}
.message.own .content {
  background-color: lightskyblue;
}
.chat-container .username {
  font-size: 18px;
  font-weight: bold;
}
.chat-container .content {
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
  max-width: 50%;
  word-wrap: break-word;
}
@media (max-width: 480px) {
  .chat-container .content {
    max-width: 60%;
  }
}
</style>
