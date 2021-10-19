<template>
  <v-container>
    <v-list>
      <v-subheader>MY CHATS</v-subheader>
      <v-list-item
        avatar
        v-for="(group, index) in chats"
        v-bind:key="group.name"
        :to="/group/ + index"
      >
        <v-list-item-content>
          <v-list-item-title v-html="group.name"></v-list-item-title>
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
    this.$store.dispatch('loadUserGroups')
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
