<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h3 id="title">Here you can find your chats!</h3>
          <chats></chats>
        </v-col>
        <v-col> </v-col>
        <create-group></create-group>
      </v-row>
      <v-row>
        <h5>Join a chat!</h5>
        <chat-list></chat-list>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Chats from './parts/Chats.vue'
import ChatList from './ChatList.vue'
import CreateGroup from './CreateGroup.vue'

export default {
  components: {
    chats: Chats,
    chatList: ChatList,
    createGroup: CreateGroup
  }
}
</script>

<style scoped>
#title {
  margin-top: 15px;
  margin-bottom: 15px;
}

h5 {
  margin-top: 30px;
}
</style>
