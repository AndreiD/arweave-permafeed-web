bra
<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class>
        <p class="mt-5 display-2">{{app.title}}</p>
        <p v-if="allVotesMap" class="mt-5 headline">
          Votes
          <kbd>{{ allVotesMap[app.title] }}</kbd>
        </p>
        <p class="mt-5 headline" v-html="this.app.description"></p>
        <p class="mt-5 title">
          Author:
          <v-btn
            @click="redirectExternal('https://github.com/'+ this.app.author)"
            outline
          >{{this.app.author}}</v-btn>
        </p>
        <p class="mt-5 headline">
          wallet:
          <v-chip>{{app.wallet}}</v-chip>
        </p>
        <kbd class="black mt-5" style="text-align: left; padding: 10px">{{codeExample}}</kbd>

        <div class="mt-5">Loaded wallet address {{userAddress}}</div>

        <div class="title mt-5">
          <v-btn @click="toogleVote = !toogleVote" outline color="primary">
            Vote up:
            <v-icon class="ma-1">fa-thumbs-up</v-icon>
          </v-btn>

          <v-btn @click="toggleTip = !toggleTip" outline color="primary">
            Tip the author
            <v-icon class="ma-1">fa-coins</v-icon>
          </v-btn>

          <v-btn @click="toggleComments = !toggleComments" outline color="primary">
            Leave a comment
            <v-icon class="ma-1">fa-envelope</v-icon>
          </v-btn>
        </div>

        <div style="background: #efefef; padding: 20px" class="dropbox mt-5" v-show="toogleVote">
          <!--VOTE AUTHOR-->
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <p class="mt-1 mb-5 title">Select your arweave wallet to vote for this application</p>

            <input accept="application/json" type="file" ref="file" @change="fileSelected" />

            <p
              v-if="arBalance"
              class="mt-3 subtitle"
            >You currently have {{arBalance}} AR Tokens in the selected wallet</p>

            <div class="fields">
              <v-btn
                class="mt-3 primary"
                @click="voteApp()"
                style="min-width:300px"
              >Vote this application</v-btn>
            </div>
          </form>
        </div>

        <div style="background: #efefef; padding: 20px" class="dropbox mt-5" v-show="toggleTip">
          <!--TIP AUTHOR-->
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
            >You currently have {{arBalance}} AR Tokens in the selected wallet</p>

            <div class="fields">
              <v-btn class="mt-3 primary" @click="sendTip()" style="min-width:300px">Tip the author</v-btn>
            </div>
          </form>
        </div>

        <div
          style="background: #efefef; padding: 20px"
          class="dropbox mt-5"
          v-show="toggleComments"
        >
          <!--TIP AUTHOR-->
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <p class="mt-1 mb-5 title">Select your arweave wallet to comment</p>

            <v-textarea style="max-width:200px" class="mt-5 mb-5" v-model="comment" label="Comment"></v-textarea>

            <input accept="application/json" type="file" ref="file" @change="fileSelected" />

            <p
              v-if="arBalance"
              class="mt-3 subtitle"
            >You currently have {{arBalance}} AR Tokens in the selected wallet</p>

            <div class="fields">
              <v-btn
                class="mt-3 primary"
                @click="leaveComment()"
                style="min-width:300px"
              >Leave a comment</v-btn>
            </div>
          </form>
        </div>

        <div v-if="txHash">
          <h2>You just sent a transaction with ID: {{txHash}}</h2>
        </div>

        <div class="mt-5" v-if="commentsList">
          <v-card>
            <v-card-title>
              Comments
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text class="pb-0">
              <v-data-table
                :items="commentsList"
                :loading="isCommentsLoading"
                item-key="id"
                :disable-initial-sort="true"
                :rows-per-page-items="[100,200,500]"
              >
                <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
                <template slot="items" slot-scope="props">
                  <tr @click="goTodetail(props.item)">
                    <td class="text-xs-left">
                      <p class="mt-1 body-1">{{ props.item.comment.replace(/['"]+/g, '') }}</p>
                      <p class="caption">by {{props.item.from}} at {{format(props.item.time)}}</p>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>

        <div class="ma-5 pa-5" v-if="!commentsList">
          There are no comments on this app.
          <v-btn @click="toggleComments = !toggleComments" flat>Be the first to write one!</v-btn>
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
      txHash: null,
      allVotesMap: null,
      savingWallet: false,
      walletUploaded: false,
      toogleVote: false,
      toggleComments: false,
      comment: null,
      commentsList: null,
      toggleTip: false,
      isCommentsLoading: false,
      arBalance: null,
      setVoters: null,
      userWallet: null,
      userAddress: null
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
    this.loadVotes();
    this.loadComments();
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

          arweave.wallets.jwkToAddress(that.userWallet).then(address => {
            that.userAddress = address;
          });

          that.displayWalletBalance();
        } catch (error) {
          this.flash(error, "error");
          console.log(error);
        }
      });
      filereader.readAsText(e.target.files[0]);
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
      if (this.arTipAmount > this.arBalance) {
        this.flash("you don't have enough funds to tip this user", "error");
        return;
      }

      if (this.setVoters.has(this.userAddress)) {
        this.flash("It seems you already voted for this app...", "error");
      }

      let tx = await arweave.createTransaction(
        { data: "vote" },
        this.userWallet
      );

      tx.addTag("App-Name", this.app.title);
      tx.addTag("Vote-For", "permafeed-hub");
      tx.addTag("Type", "vote");

      await arweave.transactions.sign(tx, this.userWallet);

      const response = await arweave.transactions.post(tx);
      var resp = response.status === 200 ? response.config.data : null;
      var respJ = JSON.parse(resp);
      this.txHash = respJ.id;
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

      let transaction = await arweave.createTransaction(
        {
          target: that.app.wallet,
          quantity: arweave.ar.arToWinston((this.arTipAmount * 75) / 100),
          reward: arweave.ar.arToWinston((this.arTipAmount * 25) / 100)
        },
        that.userWallet
      );
      transaction.addTag("App-Name", this.app.title);
      transaction.addTag("Type", "permafeed_author_tip");
      await arweave.transactions.sign(transaction, that.userWallet);

      const response = await arweave.transactions.post(transaction);
      var resp = response.status === 200 ? response.config.data : null;
      var respJ = JSON.parse(resp);
      that.txHash = respJ.id;
    },
    async leaveComment() {
      if (!this.userWallet) {
        this.flash("you need first to select a wallet", "error");
        return;
      }
      if (this.arBalance < 0.001) {
        this.flash("you don't have enough funds to leave a comment", "error");
        return;
      }
      if (this.comment == null) {
        this.flash("please fill the comment with some text...", "error");
        return;
      }

      let tx = await arweave.createTransaction(
        { data: JSON.stringify(this.comment) },
        this.userWallet
      );

      tx.addTag("App-Name", this.app.title);
      tx.addTag("Time", new Date().getTime());
      tx.addTag("Type", "permafeed-hub-comment");

      await arweave.transactions.sign(tx, this.userWallet);

      const response = await arweave.transactions.post(tx);
      var resp = response.status === 200 ? response.config.data : null;
      var respJ = JSON.parse(resp);
      this.txHash = respJ.id;
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

      const res = await arweave.api.post(`arql`, queryVotes);
      if (res.data.length == 0) {
        console.log("no votes detected for this app");
        return;
      }

      this.setVoters = new Set();
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
      var votesMap = new Map();

      for (let i = 0; i < votes.length; i++) {
        if (votesMap[votes[i]["app-name"]] === undefined) {
          votesMap[votes[i]["app-name"]] = 1;
        } else {
          votesMap[votes[i]["app-name"]] = votesMap[votes[i]["app-name"]] + 1;
        }
      }

      this.allVotesMap = votesMap;
    },
    redirectExternal(url) {
      window.open(url, "_target");
    },
    format(date) {
      date = new Date(date * 1);
      const day = `${date.getUTCDate()}`.padStart(2, "0");
      const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    },
    async loadComments() {
      const queryComments = {
        op: "and",
        expr1: {
          op: "equals",
          expr1: "Type",
          expr2: "permafeed-hub-comment"
        },
        expr2: {
          op: "equals",
          expr1: "App-Name",
          expr2: this.app.title
        }
      };
      this.isCommentsLoading = true;

      const res = await arweave.api.post(`arql`, queryComments);
      if (res.data.length == 0) {
        console.log("no comments detected for this app");
        return;
      }
      var comments = await Promise.all(
        res.data.map(async id => {
          let txRow = {};
          const tx = await arweave.transactions.get(id);

          const comment = tx.get("data", {
            decode: true,
            string: true
          });

          tx.get("tags").forEach(tag => {
            let key = tag.get("name", { decode: true, string: true });
            let value = tag.get("value", { decode: true, string: true });
            txRow[key.toLowerCase()] = value;
          });

          txRow["id"] = id;
          txRow["from"] = await arweave.wallets.ownerToAddress(tx.owner);
          txRow["comment"] = comment;

          return txRow;
        })
      );
      this.isCommentsLoading = false;
      this.commentsList = comments;
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
