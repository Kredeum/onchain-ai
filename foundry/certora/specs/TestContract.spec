
// methods {
//   function test1() external returns (Buffer.buffer memory) envfree;
//   function test2() external returns (Buffer.buffer memory) envfree;
// }

// rule testsIdem() {
//   assert test1() == test2();
// }

// rule notAllwaysReverts(method f, env e, calldataarg args) { f@withrevert(e, args);	satisfy !lastReverted; }


rule sendRequestNotAlwaysReverts(env e, string input) {

  sendRequest@withrevert(e, input);

  satisfy !lastReverted;
}
