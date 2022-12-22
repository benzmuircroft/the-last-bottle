import React from "react";

function Cell({c,r,henry,gp,bottle}){

    var who='';
    var content='';
    if(c-1===0&&r-1===0){
        //the first cell is always blank
        }
    else if(c-1===0&&r-1>0){
        content='R'+(r-1);//the row lables
    }
    else if(r-1===0){
        content='C'+(c-1);//the column lables
        }
    else{
        content=[];
        if(gp.current[0][0]===c-1&&gp.current[0][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpC'} style={{color:'white'}}>C</b>]);
        }
        if(gp.current[1][0]===c-1&&gp.current[1][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpNW'} style={{color:'pink'}}>NW</b>]);
        }
        if(gp.current[2][0]===c-1&&gp.current[2][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpN'} style={{color:'pink'}}>N</b>]);
        }
        if(gp.current[3][0]===c-1&&gp.current[3][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpNE'} style={{color:'pink'}}>NE</b>]);
        }
        if(gp.current[4][0]===c-1&&gp.current[4][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpE'} style={{color:'pink'}}>E</b>]);
        }
        if(gp.current[5][0]===c-1&&gp.current[5][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpSE'} style={{color:'pink'}}>SE</b>]);
        }
        if(gp.current[6][0]===c-1&&gp.current[6][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpS'} style={{color:'pink'}}>S</b>]);
        }
        if(gp.current[7][0]===c-1&&gp.current[7][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpSW'} style={{color:'pink'}}>SW</b>]);
        }
        if(gp.current[8][0]===c-1&&gp.current[8][1]===r-1){
            who=' gp';
            content=content.concat([<b key={'gpW'} style={{color:'pink'}}>W</b>]);
        }
        if(bottle.current[0]===c-1&&bottle.current[1]===r-1){
            who=' bottle';
            content=content.concat([<b key={'bottle'} style={{color:'white'}}>b</b>]);
            }
        if(henry.current[0]===c-1&&henry.current[1]===r-1){
            who=' henry';
            content=content.concat([<b key={'henry'} style={{color:'white'}}>H</b>]);
            }
    }

    return (
        <div className={"Cell c"+(c-1)+" r"+(r-1)+who} style={{left:((c-1)*30)+'px',top:((r-1)*30)+'px'}}>
            {content}
        </div>
    );
}

export default Cell;