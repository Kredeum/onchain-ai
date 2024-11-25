methods {
  function meaningOfLife(uint,uint) external returns(uint) envfree;
}

rule meaningOfLifeRule(uint a, uint b) {
  assert meaningOfLife(a,b) == 42;
}