<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class>
        <p class="mt-5 display-2">{{this.$route.params.app.title}}</p>
        <p class="mt-5 headline" v-html="this.$route.params.app.description"></p>
        <p class="mt-5 title">
          Author:
          <v-btn
            @click="redirectExternal('https://github.com/'+$route.params.app.author)"
            outline
          >{{this.$route.params.app.author}}</v-btn>
        </p>
        <p class="mt-5 headline">
          wallet:
          <v-chip>{{this.$route.params.app.wallet}}</v-chip>
        </p>
        <kbd class="black mt-5" style="text-align: left; padding: 10px">{{codeExample}}</kbd>
        <div class="mt-5">
          Vote up:
          <v-btn @click="toogleVote = !toogleVote" outline fab color="primary">
            <v-icon>fa-thumbs-up</v-icon>
          </v-btn>
        </div>

        <div style="background: #efefef; padding: 20px" class="mt-5" v-show="toogleVote">
          <p class="headline">You can upvote a permafeed under it's issue in github</p>
          <p
            class="body-1"
          >example, you can upvote this app by clicking the thumb icon under it's post</p>
          <p style="font-weight:bold">please search the correct app listed under github issues!</p>
          <p>
            Click
            <v-btn
              @click="redirectExternal('https://github.com/AndreiD/arweave-permafeed-web/issues/1')"
              outline
            >HERE</v-btn>to see how you can vote
          </p>
          <p>I collect the votes every couple of days and update this list</p>
        </div>

        <div class="mt-5">
          Tip the author:
          <v-btn @click="toggleTip = !toggleTip" outline fab color="primary">
            <v-icon>fa-dollar-sign</v-icon>
          </v-btn>
        </div>

        <div style="background: #efefef; padding: 20px" class="mt-5" v-show="toggleTip">
          <p class="headline">You tip directly the author by sending AR Tokens to the feed's wallet</p>
          <p class="body-1">
            <qrcode-vue
              style="padding: 10px"
              :value="this.$route.params.app.wallet"
              :size="size"
              level="H"
            ></qrcode-vue>
            <v-chip>{{this.$route.params.app.wallet}}</v-chip>
          </p>
          <p class="body-2" style="font-weight:bold">Send only AR Tokens at the above address</p>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import QrcodeVue from "qrcode.vue";

export default {
  data() {
    return {
      toogleVote: false,
      toggleTip: false,
      size: 300
    };
  },
  computed: {
    codeExample: function() {
      // `this` points to the vm instance
      return atob(this.$route.params.app.code_example);
    }
  },
  methods: {
    redirectExternal(url) {
      window.open(url, "_target");
    }
  },
  components: {
    QrcodeVue
  }
};
</script>
