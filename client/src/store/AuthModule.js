import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { Api } from '../Api'

const AuthModule = {
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      const userListRef = firebase.database().ref('presence')
      const myUserRef = userListRef.push()

      firebase.database().ref('.info/connected')
        .on(
          'value', function (snap) {
            if (snap.val()) {
              // if we lose network then remove this user from the list
              myUserRef.onDisconnect()
                .remove()
              // set user's online status
              const presenceObject = { user: payload, status: 'online' }
              myUserRef.set(presenceObject)
            } else {
              // client has lost network
              const presenceObject = { user: payload, status: 'offline' }
              myUserRef.set(presenceObject)
            }
          }
        )
    }
  },
  actions: {
    signUserUp({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          auth => {
            Api.post('/register', payload)
            firebase.database().ref('users').child(auth.user.uid).set({
              name: payload.username
            })
              .then(
                message => {
                  commit('setLoading', false)
                  const newUser = {
                    id: auth.user.uid,
                    username: payload.username
                  }
                  commit('setUser', newUser)
                  localStorage.setItem('email', auth.user.email)
                }
              )
              .catch(
                error => {
                  commit('setLoading', false)
                  commit('setError', error)
                }
              )
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          auth => {
            firebase.database().ref('users').child(auth.user.uid).once('value', function (data) {
              Api.post('/auth', { uid: auth.user.uid })
              commit('setLoading', false)
              const newUser = {
                id: auth.user.uid,
                username: auth.user.email
              }
              commit('setUser', newUser)

              /** uid == jwt */
              localStorage.setItem('email', auth.user.email)
            })
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  }
}
export default AuthModule
