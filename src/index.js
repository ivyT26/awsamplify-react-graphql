// require("file-loader?name=[name].[ext]!index.html"); //load the index.html file into the dist folder for build production
import React from "react";
import ReactDOMclient from "react-dom/client";
import App from "./App.js";

import "./App.css";

import { Amplify } from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

const appConnect = document.getElementById("root");

ReactDOMclient.createRoot(appConnect).render(<App />);