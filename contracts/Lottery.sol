// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract Lottery {
    address payable public manager;
    address payable[] public players;

    constructor() {
        manager = payable(msg.sender);
    }

    function enter() public payable {
        require(msg.value > 0.1 ether, "min amount of 0.1 ether req to enter");
        players.push(payable(msg.sender));
    }

    function givePrize() public payable isOwner {
        address myAddress = address(this);
        players[getRandomIndex(players.length)].transfer(
            (myAddress.balance * 6) / 10
        );
        manager.transfer(myAddress.balance);
        players = new address payable[](0);
    }

    function getRandomIndex(uint256 range) private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.number, players)
                )
            ) % range;
    }

    modifier isOwner() {
        require(msg.sender == manager,"Only owner allowed!");
        _;
    }
}
