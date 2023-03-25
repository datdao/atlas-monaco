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
                defaultValue="// https://atlasgo.io/atlas-schema/sql-resources"
            />
        </div>

    );
  }
  
  export default HCLSchemaEditor;