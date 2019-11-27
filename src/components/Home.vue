<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Sqoodle Users
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-card-text class="pb-0">
        <v-data-table
          :search="search"
          :headers="headers"
          :items="users"
          :loading="isLoading"
          item-key="id"
          :rows-per-page-items="[100,200,500]"
        >
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-left">{{ props.item.id.substring(0, 8)+"..." }}</td>
              <td class="text-xs-left">{{ props.item.eth_address }}</td>
              <td class="text-xs-left">{{ format(props.item.date_created) }}</td>
              <td class="text-xs-left">{{ props.item.first_name + " " + props.item.last_name }}</td>
              <td class="text-xs-left">{{ props.item.country }}</td>
              <td class="text-xs-left">{{ props.item.coins_earned }}</td>
              <td class="text-xs-left">{{ props.item.coins_redeemed }}</td>
            </tr>
          </template>
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">Sorry, nothing to display here :(</v-alert>
          </template>

          <template v-slot:no-results>
            <v-alert
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      search: "",
      user: {},
      token: "",
      isLoading: true,
      users: [],
      headers: [
        {
          text: "ID",
          value: "id",
          align: "left",
          sortable: false
        },
        { text: "ETH Address", align: "left", value: "eth_address" },
        { text: "Created", align: "left", value: "date_created" },
        { text: "Name", align: "left", value: "last_name" },
        { text: "Country", align: "left", value: "country" },
        { text: "Coins Earned", align: "left", value: "coins_earned" },
        { text: "Coins Redeemed", align: "left", value: "coins_redeemed" }
      ]
    };
  },
  created() {
    //this.token = localStorage.getItem("token");
    //get user by token
    // axios
    //   .get("/admin/me")
    //   .then(res => {
    //     this.user = res.data;
    //     this.listUsers();
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.flash(error, "error");
    //   });
  },
  methods: {
    listUsers() {
      axios
        .get("/admin/users/all?offset=0&limit=50")
        .then(res => {
          this.users = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.flash(error, "error");
        });
    },
    format(date) {
      date = new Date(date * 1000);
      const day = `${date.getUTCDate()}`.padStart(2, "0");
      const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }
};
// this.users.loading = true;
// userService.getAll().then(users => (this.users = users));
</script>
