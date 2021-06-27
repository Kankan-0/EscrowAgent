const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("Contract", () => {
  let contract;
  const deposit = ethers.utils.parseEther("1");
  beforeEach(async () => {
    [depositor, arbiter, beneficiary] = await ethers.provider.listAccounts();
    const contractFactory = await ethers.getContractFactory("Escrow");
    contract = await contractFactory.deploy(arbiter, beneficiary, {
      value: deposit,
    });
    await contract.deployed();
  });

  it("Should declare an arbiter address", () => {
    assert(contract.arbiter, "No arbiter found");
  });
  it("Should declare an beneficiary address", () => {
    assert(contract.beneficiary, "No beneficiary found");
  });
  it("Should declare an depositor address", () => {
    assert(contract.depositor, "No depositor found");
  });
  it("Should set the correct arbiter address", async () => {
    const aribterAddress = await contract.arbiter();
    assert.equal(aribterAddress, arbiter, "Wrong arbiter set");
  });
  it("Should set the correct beneficiary address", async () => {
    const beneficiaryAddress = await contract.beneficiary();
    assert.equal(beneficiaryAddress, beneficiary, "Wrong beneficiary set");
  });
  it("Should set the correct depositor address", async () => {
    const depositorAddress = await contract.depositor();
    assert.equal(depositorAddress, depositor, "Wrong depositor set");
  });
  it("Should have a balance", async () => {
    const balanceOfContract = await ethers.provider.getBalance(
      contract.address
    );
    assert.equal(
      balanceOfContract.toString(),
      deposit.toString(),
      "Balance of the contract does not match with the initial deposited amount"
    );
  });
  describe("Approve method", () => {
    let beforeBalanceBeneficiary, beforeBalanceContract, signer;
    beforeEach(async () => {
      beforeBalanceBeneficiary = await ethers.provider.getBalance(beneficiary);
      beforeBalanceContract = await ethers.provider.getBalance(
        contract.address
      );
      signer = await ethers.provider.getSigner(arbiter);
    });

    it("Should have an approve function", () => {
      assert(contract.approve, "No approval function found");
    });

    describe("after approval from arbiter", () => {
      it("Should transfer the contract balance to the beneficiary account", async () => {
        await contract.connect(signer).approve();
        const afterBalanceBeneficiary = await ethers.provider.getBalance(
          beneficiary
        );
        assert.equal(
          afterBalanceBeneficiary.sub(beforeBalanceBeneficiary).toString(),
          beforeBalanceContract.toString()
        );
      });
    });
    describe("on approval from address other than arbiter", () => {
      it("Should fail if someone else other than arbiter calls the approve function", async () => {
        let error;

        try {
          await contract.approve();
        } catch (e) {
          error = e;
        }
        assert.equal(
          error.message,
          "VM Exception while processing transaction: reverted with reason string 'Caller is not the arbiter'"
        );
      });
    });
  });
});
