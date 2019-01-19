import "./stylesheets/main.css";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";

// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------

import { remote } from "electron";
import jetpack from "fs-jetpack";
import {hammer} from "hammerjs";
import env from "env";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

for (let container of document.querySelectorAll(".draggable .dragbar")) {
  var mc = new Hammer(container);

  // add a "PAN" recognizer to it (all directions)
  mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
  
  container.parentNode.setAttribute("data-x", container.offsetLeft);
  container.parentNode.setAttribute("data-y", container.offsetTop);

  // tie in the handler that will be called
  mc.on("pan", function (event) {
    var elem = event.target;
    var lastPosX = parseInt(elem.parentNode.dataset.x);
    var lastPosY = parseInt(elem.parentNode.dataset.y);
    elem.parentNode.style.left = event.deltaX + lastPosX + "px";
    elem.parentNode.style.top = event.deltaY + lastPosY + "px";

    if (event.isFinal) {
      elem.parentNode.setAttribute("data-x", elem.parentNode.style.left);
      elem.parentNode.setAttribute("data-y", elem.parentNode.style.top);
    }
  });
}

