import React, {useState} from "react";
import {useSearchParams} from "react-router-dom";

// import {selectLpu} from "../store/actions";
import {getAvailableLpu} from "../helper";
import {store} from "../store/store";
import Loader from "./Loader";

export default function LeftPanel() {
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    if(store?.getState()?.availableLpu.length === 0 ) {
        getAvailableLpu().then(() => setLoading(false))
    }

    const lpuList = store?.getState()?.availableLpu ?? [];

    const onClickButtonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        const id = event.currentTarget.id;
        const mainId = id.split('-');
        const selectedLpu = store.getState().availableLpu.find(item => item.name === mainId[0]);
        if(selectedLpu) {
            // selectLpu({
            //     name: selectedLpu.name,
            //     availableLpuTypes: selectedLpu.availableLpuTypes
            // });

            const fileType = searchParams.get('fileType') ?? 'yaml';
            const searchLpuType = searchParams.get('lpuType') ?? ''
            let lpuType = searchLpuType && selectedLpu.availableLpuTypes.includes(searchLpuType)
                ? searchLpuType
                : selectedLpu.availableLpuTypes[0];

            setSearchParams({
                lpu: id,
                fileType,
                lpuType
            })
        }
    }
    const lpu= searchParams.get('lpu') ?? '';
    let splitedLpu = lpu.split('-');

    const displayChildElements = (event: React.MouseEvent<HTMLButtonElement>) => {
        debugger
        const div = event.currentTarget.parentNode as HTMLDivElement;
        const ul = div.getElementsByTagName('ul')[0]

        if(ul.className.includes('hidden')) {
            ul.classList.remove('hidden')
        } else {
            ul.classList.add('hidden')
        }
    }

    return (
        <aside id="cta-button-sidebar" className="fixed left-0 z-40 w-100 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            {loading && <Loader />}
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                     {lpuList?.map((lpu, key) => {
                         if(lpu.childElements) {
                             return (
                                 <li key={`${key}-${lpu.name}`}>
                                     <div>
                                         <button type="button"
                                                 onClick={displayChildElements}
                                                 className="w-full flex items-center p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-300 dark:text-white dark:hover:bg-gray-500"
                                         >
                                             <span className="flex-1 ml-3 text-left whitespace-nowrap">{lpu.titleName}</span>
                                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                         </button>
                                         <ul id="dropdown-example"
                                             className={"py-2 space-y-2 " + (splitedLpu[0] !== lpu.name ? 'hidden' : '')}
                                         >
                                             {lpu.childElements.map(childLpu => {
                                                 const fullName = `${lpu.name}-${childLpu.name}`;

                                                 return (
                                                     <li key={fullName}>
                                                         <button onClick={onClickButtonHandler}
                                                                 id={fullName}
                                                                 className={'w-full'}
                                                         >
                                                             <span className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-300 dark:text-white dark:hover:bg-gray-500">
                                                                 {childLpu.titleName}
                                                             </span>
                                                         </button>
                                                     </li>
                                                 )
                                             })}
                                         </ul>
                                     </div>
                                  </li>
                             )
                         } else {
                             return (
                                 <li key={`${key}-${lpu.name}`}>
                                     <button onClick={onClickButtonHandler}
                                             id={lpu.name}
                                             className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                                     >
                                        <span className="ml-3">{lpu.titleName}</span>
                                     </button>
                                 </li>
                             )
                         }
                     })}
                 </ul>
            </div>
        </aside>
    )
}