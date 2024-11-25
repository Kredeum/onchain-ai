// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library PowerLib {
    function howMany(uint256 a, uint256 b) internal pure returns (uint256) {
        return _howMany(a, b);
    }

    function _howMany(uint256, uint256) private pure returns (uint256) {
        return 42;
    }
}

contract PowerContract {
    using PowerLib for uint256;

    function meaningOfLife(uint256 x, uint256 y) external pure returns (uint256) {
        return x.howMany(y);
    }
}
