<template>
  <div>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 class="text-xs-center">
          <h3>Home</h3>
          <p>
            Welcome to PlanMe! We provide an easy to use application where you
            can easily plan events with your friends
          </p>
          <v-btn :to="Chat">Chat</v-btn>
          <v-btn>Calendar</v-btn>
          <h5>Calendar</h5>
          <calendar></calendar>
          <h5>Select a chat to start!</h5>
          <p>...or create a new chat</p>
          <chats></chats>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Chats from './Chat/parts/Chats.vue'
import Calendar from './Calendar.vue'
export default {
  components: {
    chats: Chats,
    calendar: Calendar
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
