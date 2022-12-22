
import React from 'react';
import Cell from './Cell.js';


function Board({henry,gp,bottle}){


    
    var cells=[];
    for(var r=1;r<=25;r+=1){
        for(var c=1;c<=43;c+=1){
            cells=cells.concat([<Cell key={"c"+(c-1)+"r"+(r-1)} c={c} r={r} henry={henry} gp={gp} bottle={bottle}/>]);
            }
        }
        

    return (
        <div className="Board">
            {cells}
        </div>
    );
}

export default Board;
