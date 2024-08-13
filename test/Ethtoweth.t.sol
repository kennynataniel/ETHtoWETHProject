// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Ethtoweth} from "../src/Ethtoweth.sol";

contract CounterTest is Test {
    Ethtoweth public ethtoweth;

    function setUp() public {
        ethtoweth = new Ethtoweth();
        ethtoweth.setNumber(0);
    }

    function test_Increment() public {
        ethtoweth.increment();
        assertEq(ethtoweth.number(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        ethtoweth.setNumber(x);
        assertEq(ethtoweth.number(), x);
    }
}