import { CometChat } from "@cometchat-pro/chat";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { cometConfig } from "./utils/config/comet-config";

const appID = cometConfig.COMET_APP_ID;
const region = cometConfig.COMET_APP_REGION;

console.log(appID);

const appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .build();

CometChat.init(appID, appSetting)
  .then(() => {
    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById("root")
    );
    console.log("Initialization completed successfully");
  })
  .catch((error) => {
    console.log("Initialization failed with error:", error);
  });
