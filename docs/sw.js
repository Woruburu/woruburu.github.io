if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let l={};const d=e=>i(e,o),f={module:{uri:o},exports:l,require:d};s[o]=Promise.all(n.map((e=>f[e]||d(e)))).then((e=>(r(...e),l)))}}define(["./workbox-c1760cce"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"android-chrome-192x192.png",revision:"95fd25cfffd515fda18f963fd3f3ab2f"},{url:"android-chrome-512x512.png",revision:"2a2d8330881068ab73ed64c80ba7fb09"},{url:"apple-touch-icon.png",revision:"a90624b1b7ae95b6dbfc41f7312a3db7"},{url:"assets/Card.e992b5d8.js",revision:null},{url:"assets/index.38ab677b.js",revision:null},{url:"assets/index.61acc014.js",revision:null},{url:"assets/index.6ab545d0.js",revision:null},{url:"assets/index.b08e5e4d.js",revision:null},{url:"assets/index.c3a058f4.js",revision:null},{url:"assets/sql-wasm.wasm",revision:"1b0fa4ee8004632ba85abefe56855493"},{url:"assets/worker.sql-wasm.a1eef540.js",revision:null},{url:"backup.db",revision:"129eb68bc30df1b7f9cbf22f5096b311"},{url:"favicon-16x16.png",revision:"c89b16746483f3e2983e6e7441fc7236"},{url:"favicon-32x32.png",revision:"b9d65c680fb347201b2e698c4b551334"},{url:"favicon.ico",revision:"a84c7437fe4f76b5ba4d470d90a5af9c"},{url:"index.html",revision:"b3f138ff522191a9e141337c7dee1b8d"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"manifest.webmanifest",revision:"d09ea15d3444b74f89f64ecdd2d0cc62"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
