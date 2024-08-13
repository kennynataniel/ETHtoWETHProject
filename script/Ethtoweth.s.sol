// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {Ethtoweth} from "../src/Ethtoweth.sol";

contract EthtowethScript is Script {
    Ethtoweth public ethtoweth;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("ethereum_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        ethtoweth = new Ethtoweth();
        vm.stopBroadcast();
    }
}

