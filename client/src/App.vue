<template>
  <div id="app">
    <div id="nav">
      <router-link style="margin-right:30px" to="/auth">Login</router-link>
      <router-link style="margin-right:30px" to="/register">Register</router-link>
       <router-link style="margin-right:30px" to="/profile">Profile</router-link>
      <!-- <router-link style="margin-right:30px" to="/card">card</router-link> -->
      <router-link style="margin-right:30px" to="/calendar">SharedCalendar</router-link>
      <router-link to="/">Index</router-link>
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
