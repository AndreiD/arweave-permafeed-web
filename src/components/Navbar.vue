<template>
  <v-toolbar absolute flat color="black lighten-3" dark>
    <v-toolbar-title>
      Sqoodle
      <span class="yellow--text">Admin</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn flat to="/" exact>
        <v-icon left>home</v-icon>
        <span>home</span>
      </v-btn>
      <v-btn flat to="/faq" exact>
        <v-icon left>help</v-icon>
        <span>Faq</span>
      </v-btn>
      <v-btn v-if="user" flat to="/logout" exact>
        <v-icon left>logout</v-icon>
        <span>Logout</span>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>



<script>
import { userService } from "../../_services/user.service";
export default {
  data() {
    return {
      user: {},
      users: []
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("user"));
    userService.getAll().then(users => (this.users = users));
  }
};
</script>
