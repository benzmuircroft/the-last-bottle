import './App.css';
import {useReducer,useRef} from 'react';
import Board from './components/Board.js';
import Controls from './components/Controls.js';


function getZone(p){//using PGpg's position get the cells around it
    let x=p[0];
    let y=p[1];
    let nw=[//north west
        x-1===0?42:x-1,
        y-1===0?24:y-1];
    let n=[//north
        x,
        y-1===0?24:y-1];
    let ne=[//north east
        x+1===43?1:x+1,
        y-1===0?24:y-1];
    let e=[//east
        x+1===43?1:x+1,
        y,
        ];
    let se=[//south east
        x+1===43?1:x+1,
        y+1===25?1:y+1
        ];
    let s=[//south
        x,
        y+1===25?1:y+1
        ];
    let sw=[//south west
        x-1===0?42:x-1,
        y+1===25?1:y+1
        ];
    let w=[//west
        x-1===0?42:x-1,
        y
        ];
    return [
        p, nw, n ,ne, e, se, s, sw, w,
        ];
    }

function startPosition(){//used for gp, then Henry, then the bottle
    let minX=Math.ceil(1);
    let maxX=Math.floor(42);
    let minY=Math.ceil(1);
    let maxY=Math.floor(24);
    function roll(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
    return [roll(minX,maxX),roll(minY,maxY)];
    }
    
var compass=['n','ne','e','se','s','sw','w','nw'];
var opposites={
    n:'s',
    ne:'sw',
    e:'w',
    se:'nw',
    s:'n',
    sw:'ne',
    w:'e',
    nw:'se'
    };
    

function rollDices(rules){
    let min=Math.ceil(0);//because of array sellection
    let max=Math.floor(5);//^^^
    function roll(){return Math.floor(Math.random()*(max-min+1))+min;}
    let allowed=compass.map((x)=>x);
    if(rules.blocked!=='none'){
        let blocked=[rules.bar,opposites[rules.blocked]];
        allowed=allowed.filter(item=>!blocked.includes(item));
        }
    let dnum=roll()+1;
    return {
        turn: rules.turn,//whos turn it is
        dir: allowed[dnum],//direction
        dnum: dnum, //number of roll for compass allowed array
        pnum: (roll() + 1)//places to move
        //Determining the direction (Dice 1) 
        //Numbers 1 to 6 are mapped to directions starting from the first available cell starting from the North 
        //1: North 
        //2: Northeast
        //3: East 
        //4: Southeast 
        //5: South 
        //6: Southwest 
        //Previous player's direction & opposite of that direction are forbidden.
        //eg: PB rolled 1 and moved North. For Henry, North & South are not available. So if Henry rolls 3, mapping is calculated as: 
        //1: Northeast 
        //2: East 
        //3: Southeast 
        //4: Southwest 
        //5: West 
        //6: Northwest
        };
    }
    

function newPosition(dice,xy){
    console.log(dice.turn+' moves '+dice.dir+' '+dice.pnum+' places ...');
    dice.onum=dice.pnum+'';//clone original
    for(;dice.pnum;dice.pnum-=1){
        if(dice.dir==='n'){
            xy[1]-=1;
            }
        else if(dice.dir==='ne'){
            xy[0]+=1;
            xy[1]-=1;
            }
        else if(dice.dir==='e'){
            xy[0]+=1;
            }
        else if(dice.dir==='se'){
            xy[0]+=1;
            xy[1]+=1;
            }
        else if(dice.dir==='s'){
            xy[1]+=1;
            }
        else if(dice.dir==='sw'){
            xy[0]-=1;
            xy[1]+=1;
            }
        else if(dice.dir==='w'){
            xy[0]-=1;
            }
        else if(dice.dir==='nw'){
            xy[0]-=1;
            xy[1]-=1;
            }
        if(xy[0]===43){//move x position to the start if it is beond the board's right edge
            xy[0]=1;
            }
        else if(xy[0]===0){//move x position to the end if it is beond the board's left edge
            xy[0]=42;
            }
        if(xy[1]===25){//move y position to the top if it is beond the board's bottom edge
            xy[1]=1;
            }
        else if(xy[1]===0){//move y position to the bottom if it is beond the board's top edge
            xy[1]=24;
            }
        }
    console.log(dice.turn+' moved to c'+xy[0]+' r'+xy[1]);
    return {
        xy,
        block: opposites[dice.dir],
        dnum: dice.dnum,//distance moved (original number)
        pnum: dice.onum
        };
    }






function noColide(zone){//on game start: dont allow henry to collide with the gp zone (also don't alow the bottle to collide with gp or henry)
    function again(){
        let p=startPosition();
        for(let i=0;i<zone.length;i+=1){//brute force
            if(p.join('|')===zone[i].join('|')){
                p=undefined;
                break;
            }
        }
        if(p===undefined){return again();}//try again
        else{return p;}//success
        }
    return again();//first iteration, is probably correct (low hit rate)
    }


    function checkWinner(zone,xy){
        for(let i=0;i<zone.length;i+=1){//brute force
            if(xy.join('|')===zone[i].join('|')){
                xy=undefined;
                break;
                }
            }
        if(xy===undefined){
            return true;
            }
        return false
        }


    
const reducer=function(state,action){
    return action;
    };



//begin render ...


//try a useReducer to see all of the positions (previous and current) and whos turn it is to see if anyone collided with the gp (winner)
/* the board can be redrawn on dice roll or restart buttons ... */

function App(){

    
    
    const [rules,updateRules]=useReducer(reducer,{//re-renders the app
        dir: 'n/a',
        dnum: 0,
        pnum: 0,
        turn: 'henry',
        blocked: 'none',
        restart: false
        });

    //these can change without re-render
    const gp=useRef(getZone(startPosition()));

    const henry=useRef(noColide(gp.current));

    const bottle=useRef(noColide(gp.current.concat([henry.current])));
        
    henry.trigger=function(obj){//trigger setReducer to update the ui
        let move=newPosition(rollDices(rules),henry.current);
        henry.current=move.xy;
        updateRules({
            dir: opposites[move.block],
            dnum: move.dnum,
            pnum: move.pnum,
            turn: 'bottle',
            blocked: move.block,
            restart: false
            });
        if(checkWinner(gp.current,henry.current)){alert('Henry wins!');}
        };

    bottle.trigger=function(obj){//trigger setReducer to update the ui
        let move=newPosition(rollDices(rules),bottle.current);
        bottle.current=move.xy;
        updateRules({
            dir: opposites[move.block],
            dnum: move.dnum,
            pnum: move.pnum,
            turn: 'henry',
            blocked: move.block,
            restart: false
            });
            if(checkWinner(gp.current,bottle.current)){alert('Henry Looses!');}
        };


    //Problem: There is a hole in the logic in this test because the bottle and henry can occupy the same cell on their way to the the gp!
    //Solution: Henry would stack ontop of the bottle (winning the game version 2 ie: caught the bottle)
    

    return (
        <div className="App">
            <div className="headerWrapper">
                <Controls henry={henry} gp={gp} bottle={bottle} rules={rules}/>
            </div>
            <div className="gameWrapper">
                <Board henry={henry} gp={gp} bottle={bottle}/>
            </div>
            <div className="legendWrapper">
                <b style={{color:'#8b8b8b'}}>LEGEND</b>
                <div className="Legend">
                    <div className="fourty">
                        <div className="square" style={{backgroundColor:'blue'}}></div>Henry
                    </div>
                    <table  className="sixty">
                        <tbody>
                            <tr>
                                <td className="quater">N - North</td>
                                <td className="quater">E - East</td>
                                <td className="quater">NE - North East</td>
                                <td className="quater">NW - North West</td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                    <div  className="fourty">
                        <div className="square" style={{backgroundColor:'black'}}></div>The Bottle
                        <div className="square" style={{backgroundColor:'red',marginLeft:'20px'}}></div>Great Pacific garbage patch
                    </div>
                    <table  className="sixty">
                        <tbody>
                            <tr>
                                <td className="quater">S - South</td>
                                <td className="quater">E - East</td>
                                <td className="quater">SE - South East</td>
                                <td className="quater">SW - South West</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <input className="Restart" type="button" onClick={
                ()=>{
                    gp.current=getZone(startPosition());
                    henry.current=noColide(gp.current);
                    bottle.current=noColide(gp.current.concat([henry.current]));
                    updateRules({
                        dir: 'n/a',
                        dnum: 0,
                        pnum: 0,
                        turn: 'henry',
                        blocked: 'none',
                        restart: true})
                        }
                    } 
                value="START"/>
            </div>
        </div>
    );
}

export default App;
