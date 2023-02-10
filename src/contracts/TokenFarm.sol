pragma solidity >=0.5.0;

//summoning the other smart contract tokens
import "./JookToken.sol";
import "./DaiToken.sol"; 

contract TokenFarm {
    // Code goes here
    string public name = "Jook Token Farm";
    JookToken public jookToken;
    DaiToken public daiToken; //saved as a state variable

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    //mapping(address => mapping(address => uint256)) public allowance;


    constructor(JookToken _jookToken, DaiToken _daiToken) public {
        //1
        jookToken = _jookToken;
        daiToken = _daiToken;
    }

    // 1. Stake Tokens (Deposit)
    function stakeTokens(uint _amount) public {
        
        // Tranfer DAI tokens to this contract's address for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array IFF the haven't staked yet
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // 2. Unstaking tokens (Withdraw)
    // 3. Issuing Tokens

}