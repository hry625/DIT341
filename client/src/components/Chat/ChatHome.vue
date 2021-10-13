<template>
  <div>
    <v-container>
            <chats></chats>
            <create-chat></create-chat>
            <chat-list></chat-list>
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
h3 {
  margin-top: 20px;
  text-transform: uppercase;
}

h5 {
  margin-top: 80px;
  text-transform: uppercase;
}
</style>
