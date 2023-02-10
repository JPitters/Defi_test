pragma solidity >=0.5.0;

//summoning the other smart contract tokens
import "./JookToken.sol";
import "./DaiToken.sol"; 

contract TokenFarm {
    // Code goes here
    string public name = "Jook Token Farm";
    JookToken public jookToken;
    DaiToken public daiToken; //saved as a state variable

    constructor(JookToken _jookToken, DaiToken _daiToken) public {
        //1
        jookToken = _jookToken;
        daiToken = _daiToken;
    }
}