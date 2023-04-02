import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import Select from 'react-select';
import * as AtlasHCL from "../../lib";

const styles = {
    container: {
        display: "flex",
        justifyContent: "center"
    },
    title: {
        padding: 20,
        fontSize: "x-large",
        
    },
    select: {
        control: (provided) => ({
            ...provided,
            width: "fit-content",
            marginTop: 15,
        }),
    }
}

const languages = [
    {value: AtlasHCL.langIds.schema.sqlite, label: "sqlite"},
    {value: AtlasHCL.langIds.schema.mysql, label: "mysql"},
    {value: AtlasHCL.langIds.schema.postgresql, label: "postgresql"}
];

function HCLSchemaEditor() {
    const [selectedOption, setSelectedOption] = useState(languages[0]);
    
    const handleChange = (option) => {
        setSelectedOption(option)
    };

    function handleEditorDidMount(editor, monaco) {
        AtlasHCL.AutoRegister(monaco)
        AtlasHCL.ConnectEditor(monaco, editor)
    }

    const text = `
/*

    SQL RESOURCES

*/

table "logs" {
    schema = schema.public
    column "date" {
        type = date
    }
    column "text" {
        type = integer
    }
    partition {
        type = RANGE
        columns = [column.date]
    }
}

table "metrics" {
    schema = schema.public
    column "x" {
        type = integer
    }
    column "y" {
        type = integer
    }
    partition {
        type = RANGE
        by {
            column = column.x
        }
        by {
            expr = "floor(y)"
        }
    }
}    
    `

    return (
        <div>
            <div style={styles.container}>
                <div style={styles.title}>AtlasHCL Schema</div>
                <Select
                    styles={styles.select}
                    options={languages}
                    value={selectedOption}
                    onChange={handleChange}
                    />
            </div>
            <Editor
                height="90vh"
                language={selectedOption.value}
                defaultLanguage= {languages[0].value}
                defaultValue={text}
                onMount={handleEditorDidMount}
                options={{
                    wordBasedSuggestions: false
                }}
            />
        </div>

    );
  }
  
  export default HCLSchemaEditor;