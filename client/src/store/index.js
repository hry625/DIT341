import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/compat/app'

import AuthModule from './AuthModule.js'
import ChatModule from './ChatModule'

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
    selectedUsers: []
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
    }
  },
  actions: {
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
    }

  }
})
