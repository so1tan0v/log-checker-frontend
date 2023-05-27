import React from "react";
import {useState} from "react";

export function useTextarea (defaultValue: string = '') {
    const [value, setValue] = useState(defaultValue);

    const onChange = function (event: React.ChangeEvent<HTMLTextAreaElement>) {
        setValue(event.target.value)
    }

    return {
        value,
        onChange
    }
}