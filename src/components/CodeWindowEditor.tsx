// CodeEditorWindow.js

import React, {useState} from "react";

import Editor from "react-monaco-editor";
import 'monaco-yaml/yaml.worker.js';
import {setDiagnosticsOptions} from "monaco-yaml";

interface MonacoEditorProps {
    onChange : (code: string, value: string) => void,
    language : string,
    code     : string,
    theme    : string
}

setDiagnosticsOptions({
    enableSchemaRequest : true,
    hover               : true,
    completion          : true,
    validate            : true,
    format              : true,
});

window.MonacoEnvironment = {
    getWorker(moduleId, label) {
        switch (label) {
            case 'yaml':
                return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
            default:
                throw new Error(`Unknown label ${label}`);
        }
    }
};

const CodeEditorWindow = ({ onChange, language, code, theme }: MonacoEditorProps) => {
    const [value, setValue] = useState("");

    if(code !== value)
        setValue(code);

    const handleEditorChange = (value: string) => {
      setValue(value);
      onChange("code", value);
    };

    return (
        <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
            <Editor
                height       = "75vh"
                width        = {`100%`}
                language     = {language ?? 'yaml'}
                value        = {value}
                theme        = {theme}
                defaultValue = "// some comment"
                onChange     = {handleEditorChange}
            />
        </div>
    );
};
export default CodeEditorWindow;