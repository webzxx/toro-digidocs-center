import { useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";

export const HelpWidget = () => {
    return (
        <button 
        className="
        fixed bottom-10 right-10 
        p-2 px-3 hover:bg-blue-500 cursor-pointer">
            <BiSolidMessageRounded size={50}/>
        </button>
    );
};