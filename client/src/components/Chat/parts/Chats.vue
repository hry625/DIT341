<template>
<v-container>
  <v-list subheader>
    <v-list-title id="list-title">My Chats</v-list-title>
    <v-subheader>Please click on the chat to start chatting!</v-subheader>
    <v-list-item
      avatar
      v-for="(chat, index) in chats"
      v-bind:key="chat.name"
      :to="/chat/ + index"
    >
      <v-list-item-content>
        <v-list-item-title v-html="chat.name"></v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-icon>mdi-chat</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</v-container>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('loadUserChats')
  },
  computed: {
    chats() {
      return this.$store.getters.chats
    }
  }
}
</script>

<style scoped>
#list-title {
  margin-top: 40px;
}
</style>
