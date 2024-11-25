methods {
  function owner() external returns (address) envfree;
  function price() external returns (uint256) envfree;

  function Buffer.init(Buffer.buffer memory, uint) internal returns(Buffer.buffer memory) => HAVOC_ALL;
  function Buffer.fromBytes(bytes memory) internal returns(Buffer.buffer memory) => HAVOC_ALL;
  function Buffer.truncate(Buffer.buffer memory) internal returns(Buffer.buffer memory) => HAVOC_ALL;
  function Buffer.append(Buffer.buffer memory, bytes memory, uint) internal returns(Buffer.buffer memory) => HAVOC_ALL;
  function Buffer.append(Buffer.buffer memory, bytes memory) internal returns(Buffer.buffer memory) => HAVOC_ALL;
  function Buffer.appendUint8(Buffer.buffer memory, uint8) internal returns(Buffer.buffer memory) => HAVOC_ALL;
  function Buffer.appendBytes20(Buffer.buffer memory, bytes20) internal returns(Buffer.buffer memory) => HAVOC_ALL;
  function Buffer.appendBytes32(Buffer.buffer memory, bytes32) internal returns(Buffer.buffer memory) => HAVOC_ALL;
  function Buffer.appendInt(Buffer.buffer memory, uint, uint) internal returns(Buffer.buffer memory) => HAVOC_ALL;
}

rule onlyOwnerDecreaseBalance(method f, env e, calldataarg args) {
  address owner = owner();

  mathint _balanceContract = nativeBalances[currentContract];
  f(e, args);
  mathint balanceContract_ = nativeBalances[currentContract];

  assert balanceContract_ < _balanceContract => e.msg.sender == owner;
}

rule balanceModifications(method f, env e, calldataarg args) {
  mathint price = price();
  address user;
  address owner = owner();
  address sender = e.msg.sender;

  mathint _balanceContract = nativeBalances[currentContract];
  mathint _balanceUser = nativeBalances[user];
  f(e, args);
  mathint balanceContract_ = nativeBalances[currentContract];
  mathint balanceUser_ = nativeBalances[user];

  assert balanceContract_ < _balanceContract =>
    e.msg.sender == owner && balanceContract_ == 0 && f.selector == withdraw.selector;

  assert balanceContract_ > _balanceContract =>
    (balanceContract_ == _balanceContract + price) && f.selector == withdraw.selector;

  assert balanceContract_ + balanceUser_ == _balanceContract + _balanceUser;

  satisfy balanceContract_ < _balanceContract;
  satisfy balanceContract_ > _balanceContract;
}

// rule notAllwaysReverts(method f, env e, calldataarg args) { f@withrevert(e, args);	satisfy !lastReverted; }