import firebase from 'firebase/compat/app'
import { Api } from '../Api'

const ChatModule = {
  state: {
    chats: {}
  },
  mutations: {
    setChats(state, payload) {
      payload['0'] = { name: 'Default' }
      state.chats = payload
    }
  },
  actions: {
    sendMessage(context, payload) {
      const groupID = payload.groupID
      const url = '/message/' + groupID
      const message = {
        user: payload.username,
        content: payload.content,
        timestamp: payload.date
      }
      Api.post(url, message)
      firebase.database().ref().child('group').child(groupID).child('messageCount').set(firebase.database.ServerValue.increment(1))
      // .child(groupID).child('count').update(firebase.database.ServerValue.increment(1))
      //   .catch((error) => {
      //     console.log(error)
      //   }
      //   )
      // TODO:remove this
      firebase.database().ref('messages').child(groupID).child('messages').push(message)
        .then(
          (data) => {
          }
        )
    },
    loadUserGroups(context) {
      const user = context.getters.user
      firebase.database().ref('users').child(user.id).child('chats').orderByChild('timestamp').once('value', function (snapshot) {
        let chats = snapshot.val()
        if (chats == null) {
          chats = {}
        }

        for (const chatId in chats) {
          chats[chatId].name = 'Loading...'
          firebase.database().ref('chats').child(chatId).once('value', function (snapshot) {
            chats[chatId].name = snapshot.val().name
            context.commit('setChats', chats)
          })
        }
      })
    }
  },
  getters: {
    chats(state) {
      return state.chats
    }
  }
}

export default ChatModule
