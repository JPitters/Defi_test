pragma solidity >=0.5.0;

//summoning the other smart contract tokens
import "./JookToken.sol";
import "./DaiToken.sol"; 

contract TokenFarm {
    // Code goes here
    string public name = "Jook Token Farm";
    address public owner;
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
        owner = msg.sender;
    }

    // 1. Stake Tokens (Deposit)
    function stakeTokens(uint _amount) public {
        
        //require amount greater than 0
        require(_amount > 0, "amount cannot be 0 or less than 0");
        
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

    //  Issuing Tokens
    function issueTokens() public {
        //
        require(msg.sender == owner, "Token provider must be administrative owner");

        for (uint i=0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                jookToken.transfer(recipient, balance);
            }
        }
    }

    //  Unstaking tokens (Withdraw)

}