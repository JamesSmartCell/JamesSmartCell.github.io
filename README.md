This is a site that mints an ERC721 Contract, intended for use with the TokenScript sample series here:
https://github.com/TokenScript

You must have Rinkeby on your wallet account to create the constructor.

The code uses simple unprocessed in-browser JavaScript.
Dependencies, like the Web3Modal library itself,
are loaded over Unpkg CDN. The code is extensively
commented and short.

TODO:
- signing tests
- add more chains

Originally sourced from:

[Web3modal](https://github.com/web3modal/web3modal))

# Web3 wallets and HTTPS hosting limitations

Because of limitations how wallet operate within a web browser
and web security,
you should not run this example, or any Web3modal code,
out of your file system or insecure HTTP protocol
(even using localhost).

Setup on Windows:

```
npm i -g --only=prod https-localhost
serve
```

UNIX style:

```sh
npm i -g --only=prod https-localhost
sudo serve .
```

... in the folder of index.html file.

Then you can visit https://localhost to open the example.
```

