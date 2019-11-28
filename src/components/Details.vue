<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class>
        <p class="display-2">{{app.title}}</p>

        <p class="headline">
          {{totalVotes}}
          <v-icon left>fa-thumbs-up</v-icon>votes
        </p>
        <p class="mt-5 headline" v-html="this.app.description"></p>
        <p class="mt-5 title">
          Author:
          <v-btn @click="redirectExternal('https://github.com/'+ this.app.author)" outline>
            <v-icon>fa-code-branch</v-icon>
            {{this.app.author}}
          </v-btn>
        </p>
        <p class="mt-5 headline">
          Wallet:
          <v-chip>{{app.wallet}}</v-chip>
        </p>
        <kbd class="black mt-5" style="text-align: left; padding: 10px">{{codeExample}}</kbd>
        <div class="mt-5 title">
          Vote this app:
          <v-btn @click="toogleVote = !toogleVote" outline fab color="primary">
            <v-icon>fa-thumbs-up</v-icon>
          </v-btn>
        </div>

        <div style="background: #efefef; padding: 20px" class="mt-5" v-show="toogleVote">
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <p class="mt-1 mb-5 title">Select your arweave wallet to vote this application</p>

            <!-- App-Name  with Type vote -->

            <input accept="application/json" type="file" ref="file" @change="fileSelected" />

            <p
              v-if="arBalance"
              class="mt-3 subtitle"
            >You currently have {{arBalance}} AR Tokens in this wallet</p>

            <div class="fields">
              <v-btn class="mt-3 primary" @click="voteApp()" style="min-width:300px">Vote this App</v-btn>
            </div>
            <div class="message">
              <h5>{{message}}</h5>
            </div>
          </form>
        </div>

        <div class="mt-5 title">
          Tip the author:
          <v-btn @click="toggleTip = !toggleTip" outline fab color="primary">
            <v-icon>fa-dollar-sign</v-icon>
          </v-btn>
        </div>

        <div style="background: #efefef; padding: 20px" class="dropbox mt-5" v-show="toggleTip">
          <!--FORM TIP AUTHOR-->
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <p class="mt-1 mb-5 title">Select your arweave wallet to tip the author</p>

            <v-text-field
              style="max-width:200px"
              class="mt-5 mb-5"
              v-model="arTipAmount"
              label="Tip Amount (AR Tokens)"
            ></v-text-field>

            <input accept="application/json" type="file" ref="file" @change="fileSelected" />

            <p
              v-if="arBalance"
              class="mt-3 subtitle"
            >You currently have {{arBalance}} AR Tokens in this wallet</p>

            <div class="fields">
              <v-btn class="mt-3 primary" @click="sendTip()" style="min-width:300px">Tip the author</v-btn>
            </div>
            <div class="message">
              <h5>{{message}}</h5>
            </div>
          </form>
        </div>
        <div v-if="txHash">
          <h2>You submitted a transaction with ID: {{txHash}}</h2>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
//import axios from "axios";
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
  name: "Details",
  data() {
    return {
      app: null,
      arTipAmount: 0.001,
      file: "",
      hasAlreadyVoted: false,
      totalVotes: 0,
      voteCost: 0.001,
      txHash: null,
      savingWallet: false,
      walletUploaded: false,
      message: "",
      toogleVote: false,
      toggleTip: false,
      arBalance: null,
      size: 300,
      userWallet: null
    };
  },
  computed: {
    codeExample: function() {
      // `this` points to the vm instance
      return atob(this.app.code_example);
    }
  },
  created() {
    this.app = JSON.parse(window.localStorage.getItem("selected_app"));
    this.txHash = null;
    this.loadVotesForApp();
  },
  methods: {
    async fileSelected(e) {
      this.arBalance = null;
      this.txHash = null;
      const filereader = new FileReader();
      const that = this;
      filereader.addEventListener("loadend", async e => {
        try {
          that.savingWallet = false;
          that.userWallet = await JSON.parse(e.target.result);
          if (!that.userWallet) {
            this.flash("can't decode this wallet", "error");
            return;
          }
          that.displayWalletBalance();
        } catch (error) {
          this.flash(error, "error");
          console.log(error);
        }
      });
      filereader.readAsText(e.target.files[0]);
    },
    async loadVotesForApp() {
      const that = this;
      const queryVotes = {
        op: "and",
        expr1: {
          op: "equals",
          expr1: "App-Name",
          expr2: this.app.title
        },
        expr2: {
          op: "equals",
          expr1: "Type",
          expr2: "vote"
        },
        expr3: {
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
      that.totalVotes = votes.length;

      for (let i = 0; i < votes.length; i++) {
        if (votes[i]["app-name"] === that.app.title) && (votes[i]["from"] === that.awxx) {
          that.hasAlreadyVoted = true;
        }
      }
    },
    async displayWalletBalance() {
      const that = this;
      arweave.wallets.jwkToAddress(this.userWallet).then(address => {
        arweave.wallets.getBalance(address).then(balance => {
          let ar = arweave.ar.winstonToAr(balance);
          that.arBalance = ar;
        });
      });
    },
    async voteApp() {
      if (!this.userWallet) {
        this.flash("you need first to select a wallet", "error");
        return;
      }
      if (this.arTipAmount > 0.001) {
        this.flash("you don't have enough funds to vote for this app", "error");
        return;
      }

      const that = this;
      console.log("preparing to vote app....");

      const tx = await arweave.createTransaction(
        { data: "voteup" },
        that.userWallet
      );

      tx.addTag("Vote-For", "permafeed-hub");
      tx.addTag("App-Name", that.app.title);
      tx.addTag("Type", "vote");

      await arweave.transactions.sign(tx, that.userWallet);
      console.log(tx.id);
      const response = await arweave.transactions.post(tx);
      var resp = response.status === 200 ? response.config.data : null;
      var respJ = JSON.parse(resp);
      that.txHash = respJ.id;
    },
    async sendTip() {
      if (!this.userWallet) {
        this.flash("you need first to select a wallet", "error");
        return;
      }
      if (this.arTipAmount > this.arBalance) {
        this.flash("you don't have enough funds to tip this user", "error");
        return;
      }
      const that = this;
      console.log("preparing to send the tip....");

      let transaction = await arweave.createTransaction(
        {
          target: that.app.wallet,
          quantity: arweave.ar.arToWinston(this.arTipAmount)
        },
        that.userWallet
      );
      transaction.addTag("type", "permafeed_author_tip");
      await arweave.transactions.sign(transaction, that.userWallet);

      const response = await arweave.transactions.post(transaction);
      var resp = response.status === 200 ? response.config.data : null;
      var respJ = JSON.parse(resp);
      that.txHash = respJ.id;
    },
    redirectExternal(url) {
      window.open(url, "_target");
    }
  }
};
</script>
<style >
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  position: relative;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  padding: 5px 0;
}
.saving-wallet {
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.wallet-warn {
  color: #cc0000;
}
</style>
