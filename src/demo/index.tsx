import * as AtlasHCL from "../lib";
import "./index.css";
import * as ReactDOM from "react-dom";
import React, { useEffect } from "react";
import HCLSchemaEditor from "./editor/schema";
import HCLConfigEditor from "./editor/config";
import { useMonaco } from "@monaco-editor/react";

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  editor: {
    flex: 1,
  },
};

const App = () => {
  return (
    <div style={styles.container}>
      <div style={styles.editor}>
        <HCLSchemaEditor />
      </div>
      <div style={styles.editor}>
        <HCLConfigEditor />
      </div>
    </div>
  );
};

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);

ReactDOM.render(<App />, rootElement);
