<template>
  <v-app>
    <v-navigation-drawer absolute temporary v-model="drawerToggle" v-if="userIsAuthenticated">
      <v-list-item-title class="text-h6" id="menu">
        👋 Welcome
      </v-list-item-title>
      <v-list-item v-for="item in menuItems" v-bind:key="item.route">
        <v-btn text :key="item.title" :to="item.route">
          <v-icon left>{{ item.icon }}</v-icon>
          <div class="hidden-xs-only">{{ item.title }}</div>
        </v-btn></v-list-item
      >
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-title
            >Online Users {{ onlineUsers[0] }}</v-list-item-title
          >
        </template>
        <v-list-item
          avatar
          v-for="user in onlineUsers[1]"
          v-bind:key="user.user.username"
        >
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.user.username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-navigation-drawer>
    <v-app-bar app class="light-blue darken-1">
      <v-app-bar-nav-icon
        @click.native.stop="drawerToggle = !drawerToggle"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer"
          >PlanMe</router-link
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-for="item in menuBar" v-bind:key="item.route">
        <v-btn text :key="item.title" :to="item.route">
          <v-icon left>{{ item.icon }}</v-icon>
          <div class="hidden-xs-only">{{ item.title }}</div>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawerToggle: false,
      menuItems: [{ icon: 'mdi-chat', title: 'Chat', route: '/chat' },
        { icon: 'mdi-calendar', title: 'Calendar', route: '/calendar' },
        { icon: 'mdi-account', title: 'Profile', route: '/profile' }]
    }
  },
  computed: {
    menuBar() {
      let items = [
        { icon: 'mdi-account-plus', title: 'Register', route: '/register' },
        { icon: 'mdi-lock-open', title: 'Login', route: '/login' }
      ]
      if (this.userIsAuthenticated) {
        items = [
          { icon: 'mdi-logout', title: 'LogOUt', route: '/' }
        ]
      }
      return items
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      )
    },
    onlineUsers() {
      return this.$store.getters.onlineUsers
    }
  }
}
</script>

<style scoped>
#menu {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
