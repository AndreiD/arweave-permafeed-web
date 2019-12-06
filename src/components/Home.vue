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
          :disable-initial-sort="true"
          :rows-per-page-items="[100,200,500]"
        >
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr @click="goTodetail(props.item)">
              <td class="text-xs-left">
                <kbd class="title pa-1" v-if="allVotesMap">{{ allVotesMap[props.item.title] }}</kbd>
              </td>
              <td class="text-xs-left">
                <v-btn outline small>{{ props.item.title }}</v-btn>
              </td>
              <td class="text-xs-left" v-html="props.item.description"></td>
              <td class="text-xs-left">{{ props.item.author }}</td>
              <td class="text-xs-left">{{ props.item.wallet.substring(0, 8)+"..." }}</td>
            </tr>
          </template>

          <template v-slot:no-results>
            <div>Your search for "{{ search }}" found no results.</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <p class="mt-5 subtitle">permafeed wallet: qGwglm54w6I9-CCcNSAjvWzqGNZfb0zAUNkXYVYN5LY</p>
  </v-container>
</template>

<script>
import axios from "axios";
import Arweave from "arweave/web";

const arweaveOptions = {
  host: "arweave.net", // Hostname or IP address for a Arweave node
  port: 443, // Port, defaults to 1984
  protocol: "https", // Network protocol http or https, defaults to http
  timeout: 20000, // Network request timeouts in milliseconds
  logging: false // Enable network request logging
};

const arweave = Arweave.init(arweaveOptions);

export default {
  data() {
    return {
      search: "",
      token: "",
      allVotesMap: null,
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
        { text: "Wallet", align: "left", value: "wallet" }
      ]
    };
  },
  async created() {
    const txids = await arweave.arql({
      op: "and",
      expr1: {
        op: "equals",
        expr1: "from",
        expr2: "qGwglm54w6I9-CCcNSAjvWzqGNZfb0zAUNkXYVYN5LY"
      },
      expr2: {
        op: "equals",
        expr1: "app",
        expr2: "permafeedhub"
      }
    });
    // load the first one (most recent)
    axios
      .get("/tx/" + txids[0] + "/data")
      .then(res => {
        var decoded = atob(atob(res.data));
        var aux = JSON.parse(decoded);
        aux.sort((a, b) => b.votes - a.votes);
        this.apps = aux;
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        console.log(error);
        this.flash(error, "error");
      });

    this.loadVotes();
  },
  methods: {
    goTodetail(payload) {
      window.localStorage.setItem("selected_app", JSON.stringify(payload));
      this.$router.push("details");
    },
    redirectExternal(url) {
      window.open(url, "_target");
    },
    async loadVotes() {
      const queryVotes = {
        op: "and",
        expr1: {
          op: "equals",
          expr1: "Type",
          expr2: "vote"
        },
        expr2: {
          op: "equals",
          expr1: "Vote-For",
          expr2: "permafeed-hub"
        }
      };

      console.log(`fetching all votes...`);
      const res = await arweave.api.post(`arql`, queryVotes);
      console.log("finished fetching votes");
      console.log("res :", res);
      if (res.data.length == 0) {
        console.log("no votes detected for this app");
        return;
      }
      var votes = await Promise.all(
        res.data.map(async id => {
          let txRow = {};
          const tx = await arweave.transactions.get(id);

          tx.get("tags").forEach(tag => {
            let key = tag.get("name", { decode: true, string: true });
            let value = tag.get("value", { decode: true, string: true });
            txRow[key.toLowerCase()] = value;
          });

          txRow["id"] = id;
          txRow["from"] = await arweave.wallets.ownerToAddress(tx.owner);

          return txRow;
        })
      );
      console.log("votes :", votes);
      var votesMap = new Map();

      for (let i = 0; i < votes.length; i++) {
        if (votesMap[votes[i]["app-name"]] === undefined) {
          votesMap[votes[i]["app-name"]] = 1;
        } else {
          votesMap[votes[i]["app-name"]] = votesMap[votes[i]["app-name"]] + 1;
        }
      }
      console.log("votesMap :", votesMap);
      this.allVotesMap = votesMap;
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
</script>
