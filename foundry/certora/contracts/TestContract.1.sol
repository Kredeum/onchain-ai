// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Buffer} from "./Buffer.sol";

contract TestContract {
    function test1() external pure returns (Buffer.buffer memory) {
        Buffer.buffer memory buf = Buffer.buffer({buf: "", capacity: 0});
        Buffer.buffer memory buf1 = Buffer.init(buf, 0);
        Buffer.buffer memory buf2 = Buffer.appendUint8(buf1, uint8(42));

        return buf2;
    }

    function test2() external pure returns (Buffer.buffer memory) {
        Buffer.buffer memory buf = Buffer.buffer({buf: "", capacity: 0});
        Buffer.buffer memory buf2 = Buffer.appendUint8(buf, uint8(42));

        return buf2;
    }
}
