<template>
  <div>
    <v-container>
      <h3 id="title">Here you can find your chats!</h3>
      <chats></chats>
      <h5>Join a chat!</h5>
      <chat-list></chat-list>
      <create-chat></create-chat>
    </v-container>
  </div>
</template>

<script>
import Chats from './parts/Chats.vue'
import ChatList from './ChatList.vue'
import CreateChat from './Create.vue'

export default {
  components: {
    chats: Chats,
    chatList: ChatList,
    createChat: CreateChat
  }
}
</script>

<style scoped>

#title {
  margin-top: 15px;
  margin-bottom: 15px;
}

h5 {
  margin-top: 30px
}

</style>
