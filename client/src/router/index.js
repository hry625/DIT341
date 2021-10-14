import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Chat from '../components/Chat/Chat.vue'
import CreateGroup from '../components/Chat/CreateGroup.vue'
import ChatList from '../components/Chat/ChatList.vue'
import Profile from '../components/User/Profile.vue'
import Signup from '../components/User/Signup.vue'
import Signin from '../components/User/Signin.vue'
import AuthGuard from './auth-guard'
import Calendar from '../components/Calendar.vue'
import ChatHome from '../components/Chat/ChatHome.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/register',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/group/:id',
      name: 'Group',
      component: Chat,
      props: true,
      beforeEnter: AuthGuard
    },
    {
      path: '/create',
      name: 'CreateGroup',
      component: CreateGroup,
      beforeEnter: AuthGuard
    },
    {
      path: '/discover',
      name: 'JoinChat',
      component: ChatList,
      beforeEnter: AuthGuard
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar,
      beforeEnter: AuthGuard
    },
    {
      path: '/chat',
      name: 'Chat',
      component: ChatHome,
      beforeEnter: AuthGuard
    }
  ],
  mode: 'history'
})
