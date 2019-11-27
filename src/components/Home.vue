<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Permafeed Apps
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
          :items="apps"
          :loading="isLoading"
          item-key="id"
          :rows-per-page-items="[100,200,500]"
        >
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-left">{{ props.item.votes }}</td>
              <td class="text-xs-left">{{ props.item.title }}</td>
              <td class="text-xs-left">{{ props.item.description }}</td>
              <td class="text-xs-left">{{ props.item.author }}</td>
              <td class="text-xs-left">{{ props.item.wallet.substring(0, 8)+"..." }}</td>
              <td class="text-xs-left">{{ props.item.code_example.substring(0, 8)+"..." }}</td>
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
    <p class="mt-5 subtitle">current version: 3cd0DxM1uUXCGA8exHRl3LhtacHj7WM-4dBg4M0VGX8</p>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      search: "",
      token: "",
      isLoading: true,
      apps: [],
      headers: [
        {
          text: "Votes",
          value: "votes",
          align: "left",
          sortable: true
        },
        { text: "Title", align: "left", value: "title" },
        { text: "Description", align: "left", value: "description" },
        { text: "Author", align: "left", value: "author" },
        { text: "Wallet", align: "left", value: "wallet" },
        { text: "Code Example", align: "left", value: "code_example" }
      ]
    };
  },
  created() {
    axios
      .get("/tx/3cd0DxM1uUXCGA8exHRl3LhtacHj7WM-4dBg4M0VGX8/data")
      .then(res => {
        var decoded = atob(atob(res.data));
        this.apps = JSON.parse(decoded);
      })
      .catch(error => {
        console.log(error);
        this.flash(error, "error");
      });
  },
  methods: {
    listUsers() {},
    format(date) {
      date = new Date(date * 1000);
      const day = `${date.getUTCDate()}`.padStart(2, "0");
      const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }
};
</script>
