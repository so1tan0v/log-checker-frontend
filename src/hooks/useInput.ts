import React from "react";
import {useState} from "react";


export default function useInput ( defaultValue: string = '' ) {
    const [value, setValue] = useState(defaultValue);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        console.log(value);
    }

    return {
        value,
        onChange
    }
}