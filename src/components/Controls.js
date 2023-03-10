import React from "react";

function Controls({henry,bottle,rules}){

    function roll(){
        if(rules.turn==='henry'){
            henry.trigger();
            }
        else{
            bottle.trigger();
            }
        }

    return (
        <div>
            <h1 className="Title">The Last Bottle</h1>
            <div className="right">
                <div className="Dice1">Direction: <div className="box">{rules.dnum}</div> {rules.dir.toUpperCase()}</div>
                <div className="Dice2">Steps: <div className="box">{rules.pnum}</div> </div>
                <input className={"Roll"+(rules.buttons?"":" disabled")} type="button" onClick={roll} value="ROLL"/>
            </div>
        </div>
    );
}

export default Controls;
