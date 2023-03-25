import React from "react";
import Editor from "@monaco-editor/react";
import * as AtlasHCL from "../../lib";

function HCLConfigEditor() {
    const titleStyles = {
        padding: 20,
        fontSize: "x-large",
        "text-align": "center"
    }

    return (
        <>
            <div style={titleStyles}>AtlasHCL Config</div>
            <Editor
                height="90vh"
                defaultLanguage={AtlasHCL.langIds.config}
                defaultValue="// https://atlasgo.io/atlas-schema/projects"
            />
        </>
    );
  }
  
  export default HCLConfigEditor;