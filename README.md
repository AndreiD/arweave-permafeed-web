# :fire: Arweave Permafeed Hub

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/AndreiD/arweave-permafeed-web/blob/master/LICENSE)

Permafeeds are data streams you can trust: Transparent, decentralized, and open.

### Residing at: <a href="https://arweave.net/Q5sm7OQKpsmAxWd4rC4T1d5Hq_ifrE7jkde5QGf58u4>https://arweave.net/Q5sm7OQKpsmAxWd4rC4T1d5Hq_ifrE7jkde5QGf58u4</a>

<p align="center">
  <p align="center">Click on the image to enlarge it</p>
   <img alt="how it looks" height="500" src="https://raw.githubusercontent.com/AndreiD/arweave-permafeed-web/master/assets/example.png">
 </p>

### How it works

- apps have to be approved manually before they are added
- apps are ranked by votes
- a vote is unique to a wallet
- you can tip the author but 25% will go to the miners
- comments are not moderated (should they be ?)

### Build it yourself

app is build with Vue.js (actually Nuxt.js to be exact)
after you run `npm run build` go to dist folder and remove the "/" that are before the js and css scripts.
after that run from the base directory

```
arweave deploy-dir dist --key-file /PATH_TO_YOUR/arweave-wallet.json
```

### TODO://

- [ ] blacklist spam comments
- [ ] awaiting your idea

## License

MIT license.
