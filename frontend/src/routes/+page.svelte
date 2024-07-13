<script lang="ts">
  
//import { optimize } from 'svgo';

import Buffer from 'buffer';
import pako from 'pako';

import {onMount} from "svelte";


import { generatePrivateKey } from 'viem/accounts'
 
import game from "./Game.js";

onMount(async () => {
    /*
    const e = await Promise.all([
        window.fetch("http://127.0.0.1:3004/getEIP712Types/updateGame"),
        window.fetch("http://127.0.0.1:3004/getEIP712Types/create")
    ]);
    */
    let pkey = window.localStorage.getItem('pkey');
    if (!pkey) {
        pkey = generatePrivateKey();
        window.localStorage.setItem('pkey', pkey);
    }


    game(window.ROT, pkey);
});

</script>

<svelte:head>
    <script src="./rot.js" />
    <link href="/app.css" rel="stylesheet" />
</svelte:head>

<figure id="game-container">
    <div id="status-bar"></div>
    <div id="health-bar"></div>
    <div id="health-text"></div>
    <div id="inventory-use" class="overlay"></div>
    <div id="inventory-drop" class="overlay"></div>
    <div id="upgrade" class="overlay"></div>
    <div id="targeting" class="overlay"></div>
    <div id="character" class="overlay"></div>
    <div id="messages"></div>
    <div id="message-overlay"></div>
    <div id="game-instructions"></div>
    <div id="focus-instructions">Click game for keyboard focus</div>
  </figure>
  