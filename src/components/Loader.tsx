import React from "react";
import {Oval} from "react-loader-spinner";

export default function Loader() {

    return (
        <div className={'flex flex-col items-center justify-center'}>
            <Oval
              height={100}
              width={100}
              color="#0366fc"
              secondaryColor="#03a9fc"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='otval-loading'
              strokeWidth={2}
              strokeWidthSecondary={2}

            />
        </div>
    )
}