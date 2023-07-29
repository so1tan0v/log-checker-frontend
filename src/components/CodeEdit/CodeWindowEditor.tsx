import React, {useEffect, useState} from "react";
import EventEmitter from "event-emitter";
import Editor from "react-monaco-editor";
import {debounce} from "lodash";

import 'monaco-yaml/yaml.worker.js';
import {setDiagnosticsOptions} from "monaco-yaml";

import { Uri } from 'monaco-editor';

interface MonacoEditorProps {
    onChange : (code: string, value: string) => void,
    language : string,
    code     : string,
    theme    : string
}

Uri.parse('a://b/foo.yaml');

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
    },
    createTrustedTypesPolicy: (_, _1) => {
        return undefined
    }
};

const eventEmitter = EventEmitter();
const eventName = 'contentWidthChanged';

export const subscribe = (handler: () => void) => {
    eventEmitter.on(eventName, handler);
    return () => eventEmitter.off(eventName, handler);
}

export const trigger = () => eventEmitter.emit(eventName);


const CodeEditorWindow = React.memo(({ onChange, language, code, theme }: MonacoEditorProps) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (code !== value) {
            setValue(code);
        }
    }, [code]);

    const handleEditorChange = (value: any) => {
        setValue(value);
        onChange('code', value);
    };

    useEffect(() => {
        const debounced = debounce(trigger, 300);
        window.addEventListener('resize', debounced);
        return () => window.removeEventListener('resize', debounced);
    }, []);

    return (
        <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
            <Editor
                height       = "75vh"
                width        = "100%"
                language     = {language ?? 'yaml'}
                value        = {value}
                theme        = {theme}
                defaultValue = "// some comment"
                onChange     = {handleEditorChange}
            />
        </div>
    );
});
export default CodeEditorWindow;