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
              username: payload ? payload.username : 'not user',
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
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          auth => {
            const data = {
              username: payload.username,
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email
            }
            Api.post('/users', data)
            firebase.database().ref('users').child(auth.user.uid).set({
              username: payload.username,
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email
            })
              .then(
                message => {
                  commit('setLoading', false)
                  const newUser = {
                    id: auth.user.uid,
                    username: payload.username,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email
                  }
                  commit('setUser', newUser)
                  // localStorage.setItem('email', auth.user.email)
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
            console.log(payload.email)
            Api({
              method: 'GET',
              url: `/users/${payload.email}`
            }).then((res) => {
              console.log(res.data)
              commit('setLoading', false)
              const newUser = {
                id: auth.user.uid,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                username: res.data.username
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
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    },
    signOutUser() {
      console.log('signout Auth')
      firebase.auth().signOut().then(() => {
        // sucess
        console.log('signed out')
        location.reload()
        this.$router.push('/login')
      }).catch((error) => {
        // an error occurred
        console.log(error)
      })
    },
    editUser({ commit }, user) {
      commit('setLoading', true)
      Api({
        method: 'PUT',
        url: `/users/${user.email}`,
        data: user
      })
        .then(res => {
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
