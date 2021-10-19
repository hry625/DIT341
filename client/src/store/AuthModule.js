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

      firebase
        .database()
        .ref('.info/connected')
        .on('value', function (snap) {
          if (snap.val()) {
            // if we lose network then remove this user from the list
            myUserRef.onDisconnect().remove()
            // set user's online status
            const presenceObject = {
              username: payload.username,
              status: 'online'
            }
            myUserRef.set(presenceObject)
          } else {
            // client has lost network
            const presenceObject = {
              username: payload.username,
              status: 'offline'
            }
            myUserRef.set(presenceObject)
          }
        })
    }
  },
  actions: {
    signUserUp({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(auth => {
          Api.post('/users', payload)
          firebase
            .database()
            .ref('users')
            .child(auth.user.uid)
            .set({
              username: payload.username,
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email
            })
            .then(message => {
              commit('setLoading', false)
              const newUser = {
                id: auth.user.uid,
                username: payload.username,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email
              }
              commit('setUser', newUser)
              localStorage.setItem('email', auth.user.email)
            })
            .catch(error => {
              commit('setLoading', false)
              commit('setError', error)
            })
        })
        .catch(error => {
          commit('setLoading', false)
          commit('setError', error)
        })
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(auth => {
          Api({
            method: 'GET',
            url: '/users',
            params: { email: payload.email }
          })
            .then(res => {
              console.log(res.data)
              commit('setLoading', false)
              const newUser = {
                id: auth.user.uid,
                firstName: res.data[0].firstName,
                lastName: res.data[0].lastName,
                email: res.data[0].email,
                username: res.data[0].username
              }
              commit('setUser', newUser)
            })
            .catch(error => {
              commit('setLoading', false)
              commit('setError', error)
            })
          // firebase.database().ref('users').child(auth.user.uid).once('value', function (data) {
          //   commit('setLoading', false)
          //   const newUser = {
          //     id: auth.user.uid,
          //     username: auth.user.email
          //   }
          //   commit('setUser', newUser)
          // })
        })
        .catch(error => {
          commit('setLoading', false)
          commit('setError', error)
        })
    },
    editUser({ commit }, user) {
      commit('setLoading', true)
      Api({
        method: 'PUT',
        url: '/users/:email',
        params: { email: user.email },
        data: user
      })
        .then(res => {
          // firebase.auth().onAuthStateChanged(user => {
          // try {
          //   const u = firebase.auth().currentUser

          //   u.updateProfile({
          //     email: user.email
          //   })
          // } catch (e) {}

          // firebase.auth().onAuthStateChanged(u => {
          //   if (u) {
          //     // User logged in already or has just logged in.
          //     console.log(u.uid)

          //     u.updateProfile({ email: user.email })
          //     // firebase.auth().updateUser(user.uid, user)

          //     // u.updateProfile(user)
          //   }
          // })

          // });
          console.log(res.data)
          commit('setLoading', false)
          commit('setUser', res.data)
        })
        .catch(error => {
          commit('setLoading', false)
          commit('setError', error)
        })
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  }
}
export default AuthModule
