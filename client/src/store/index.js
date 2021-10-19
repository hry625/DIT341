import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/compat/app'

import AuthModule from './AuthModule.js'
import ChatModule from './ChatModule'
import { Api } from '../Api.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    auth: AuthModule,
    chat: ChatModule
  },
  state: {
    loading: false,
    error: null,
    onlineUsers: [],
    currentGroupID: null,
    selectedUsers: [],
    currentGroupUser: []
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    setOnlineUsers(state, payload) {
      state.onlineUsers = payload
    },
    setGroupID(state, payload) {
      console.log(payload)
      state.currentGroupID = payload
    },
    setSelectedUser(state, payload) {
      state.selectedUsers = payload
    },
    setGroupUser(state, payload) {
      state.currentGroupUser = payload
    }
  },
  actions: {
    loadGroupUser({ commit }) {
      var groupID = this.state.currentGroupID
      var url = '/groups/' + groupID
      var usrList = []
      Api.get(url)
        .then((response) => {
          // console.log(response.data)
          console.log(response)
          var membersList = response.data.groupMember
          console.log(membersList)
          for (const index in membersList) {
            console.log(membersList[index].username)
            usrList.push(membersList[index].username)
          }
          console.log(usrList)
          commit('setGroupUser', usrList)
        })
        .catch((error) => {
          this.users = []
          console.log(error)
          //   TODO: display some error message instead of logging to console
        })
    },
    loadOnlineUsers({ commit }) {
      firebase.database().ref('presence').on('value', function (snapshot) {
        var result = []
        result[0] = snapshot.numChildren()
        result[1] = snapshot.val()
        commit('setOnlineUsers', result)
      })
    },
    clearError({ commit }) {
      commit('clearError')
    },
    clearSelectedUsers({ commit }) {
      this.state.selectedUsers = []
    }
  },
  getters: {
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    },
    onlineUsers(state) {
      return state.onlineUsers
    },
    groupID(state) {
      return state.currentGroupID
    },
    selectedUsers(state) {
      return state.selectedUsers
    },
    currentGroupUser(state) {
      return state.currentGroupUser
    }

  }
})
