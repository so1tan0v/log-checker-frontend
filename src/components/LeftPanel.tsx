import React from "react";
import {useSearchParams} from "react-router-dom";

import {useSelector} from "react-redux";
import {IRootState} from "../store/rootReduser";
import {getLpuById} from "../helper";

const classOfSelectedItem: string = 'bg-gray-400';

export default function LeftPanel() {
    const availableLpu = useSelector((state: IRootState) => state.availableLpu) ?? [];
    const [searchParams, setSearchParams] = useSearchParams();

    const onClickButtonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        const id = event.currentTarget.id;
        const selectedLpu = getLpuById(id);

        if(selectedLpu) {
            const searchLpuType = searchParams.get('lpuType') ?? ''
            let lpuType = searchLpuType && Object.keys(selectedLpu.category).includes(searchLpuType)
                ? searchLpuType
                : Object.keys(selectedLpu.category)[0];

            const availableFileType = Object.keys(selectedLpu.category[lpuType]);
            let fileType = searchParams.get('fileType') ?? 'yaml';
            if(!availableFileType.includes(fileType))
                fileType = availableFileType[0];

            setSearchParams({
                lpu: id,
                fileType,
                lpuType
            })
        }
    }
    const selectedLpu= searchParams.get('lpu') ?? '';
    let splitedLpu = selectedLpu.split('-');

    const displayChildElements = (event: React.MouseEvent<HTMLButtonElement>) => {
        const div = event.currentTarget.parentNode as HTMLDivElement;
        const ul = div.getElementsByTagName('ul')[0];

        if(ul.className.includes('hidden'))
            ul.classList.remove('hidden');
        else
            ul.classList.add('hidden');
    }

    return (
        <aside id="cta-button-sidebar" className="left-0 z-40 full-screen-minus-50px transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 ">
                <ul className="space-y-2 font-medium">
                     {availableLpu?.map((lpu, key) => {
                         if(lpu.childElements) {
                             return (
                                 <li key={`${key}-${lpu.name}`}>
                                     <div>
                                         <button type      = "button"
                                                 onClick   = {displayChildElements}
                                                 className = {`w-full flex items-center p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-300 ${selectedLpu === lpu.name ? classOfSelectedItem : ``}`}
                                         >
                                             <span className="flex-1 ml-3 text-left whitespace-nowrap">
                                                 {lpu.titleName}
                                             </span>
                                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                             </svg>
                                         </button>
                                         <ul id        = "dropdown-example"
                                             className = {"py-2 space-y-2 " + (splitedLpu[0] !== lpu.name ? 'hidden' : '')}
                                         >
                                             {lpu.childElements.map(childLpu => {
                                                 const fullName = `${lpu.name}-${childLpu.name}`;

                                                 return (
                                                     <li key={fullName}>
                                                         <button onClick   = {onClickButtonHandler}
                                                                 id        = {fullName}
                                                                 className = {'w-full'}
                                                         >
                                                             <span className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-300 ${selectedLpu === `${lpu.name}-${childLpu.name}` ? classOfSelectedItem : ``}`}>
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
                                     <button onClick   = {onClickButtonHandler}
                                             id        = {lpu.name}
                                             className = {`w-full flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-300 ${selectedLpu === lpu.name ? classOfSelectedItem : ``}`}
                                     >
                                        <span className="ml-3">
                                            {lpu.titleName}
                                        </span>
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