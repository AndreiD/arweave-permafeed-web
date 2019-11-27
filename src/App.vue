<template>
  <v-app>
    <v-navigation-drawer dark mobile-break-point="800" width="240" app v-model="drawer">
      <v-list two-line>
        <v-list-tile v-for="(item, index) in items" :key="index" :to="item.path">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar flat fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer;"></v-toolbar-side-icon>
      <v-toolbar-title>
        <span class="font-weight-bold">Arweave</span>
        <span class="grey--text">&nbsp;Permafeed Hub</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-content class="mb-4">
      <v-container fluid fill-height>
        <v-layout>
          <v-flex>
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="px-3 d-flex justify-content-between grey--text" app>
      <span>Copyright andreid &copy; 2019 - present</span>
    </v-footer>
    <flash-message class="flash-message"></flash-message>
  </v-app>
</template>

<script>
require("vue-flash-message/dist/vue-flash-message.min.css");
export default {
  data() {
    return {
      drawer: true,
      url: "",
      busy: false,
      items: [
        {
          path: "/",
          title: "Home",
          icon: "fa-home"
        },
        {
          path: "/add",
          title: "Add",
          icon: "fa-plus-circle"
        }
      ],
      right: null
    };
  }
};
</script>



<style type="text/css">
.application {
  font-family: "Roboto", sans-serif;
}
.headline,
.title,
.subheading {
  font-family: "Roboto" !important;
}
.flash-message {
  display: flex;
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 999;
}
.flash__message {
  z-index: 999;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 15px 30px 15px 15px;
  margin-bottom: 10px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #cccccc;
  position: relative;
}
.flash__message.success {
  color: #3c763d !important;
  background-color: #dff0d8 !important;
  border-color: #d6e9c6 !important;
}
.flash__message.warning {
  color: #413115 !important;
  background-color: #fcf8e3 !important;
  border-color: #faebcc !important;
}
.flash__message.error {
  color: #a94442 !important;
  background-color: #f2dede !important;
  border-color: #ebccd1 !important;
}
.flash__message.info {
  color: #37516a !important;
  background-color: #f2f5fe !important;
  border-color: rgb(223, 227, 240) !important;
}
.v-content {
  padding: 0 20px 50px;
  background-color: #fefefe;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.loading:after {
  content: " .";
  animation: dots 1s steps(5, end) infinite;
}
@keyframes dots {
  0%,
  20% {
    color: rgba(0, 0, 0, 0);
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  40% {
    color: black;
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  60% {
    text-shadow: 0.25em 0 0 black, 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  80%,
  100% {
    text-shadow: 0.25em 0 0 black, 0.5em 0 0 black;
  }
}
</style>
