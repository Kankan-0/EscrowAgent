const hre = require("hardhat");
const { ethers } = hre;
const { assert } = require("chai");

describe("Aave Escrow Contract", function () {
  let contract, aWETH;
  let arbiter, beneficiary, depositor;
  const wethGatewayAddress = "0xDcD33426BA191383f1c9B431A342498fdac73488";
  const deposit = ethers.utils.parseEther("1");
  before(async () => {
    [depositor, arbiter, beneficiary] = await ethers.provider.listAccounts();
    const contractFactory = await ethers.getContractFactory("AaveEscrow");
    contract = await contractFactory.deploy(arbiter, beneficiary, {
      value: deposit,
    });
    await contract.deployed();
    aWETH = await ethers.getContractAt(
      "IERC20",
      "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e"
    );
  });

  describe("Basic contract setup", () => {
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
    it("Should not have an ether balance", async () => {
      const balanceOfContract = await ethers.provider.getBalance(
        contract.address
      );
      assert.equal(balanceOfContract.toString(), "0");
    });
    it("Should have aWETH balance", async function () {
      const balance = await aWETH.balanceOf(contract.address);
      assert.equal(balance.toString(), deposit.toString());
    });
  });

  describe("Approve method", () => {
    it("Should have an approve function", () => {
      assert(contract.approve, "No approval function found");
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
    describe("after approval from arbiter", () => {
      let signer;
      let beneficiaryBalanceBefore, depositorBalanceBefore;
      before(async () => {
        const thousandDays = 1000 * 24 * 60 * 60;
        await hre.network.provider.request({
          method: "evm_increaseTime",
          params: [thousandDays],
        });

        beneficiaryBalanceBefore = await ethers.provider.getBalance(
          beneficiary
        );
        depositorBalanceBefore = await ethers.provider.getBalance(depositor);
        signer = await ethers.provider.getSigner(arbiter);
        await contract.connect(signer).approve();
      });

      it("Should give the WETH gateway allowance to spend the initial deposit", async () => {
        // await contract.connect(signer).approve();
        const allowance = await aWETH.allowance(
          contract.address,
          wethGatewayAddress
        );
        assert(
          allowance.gt(deposit),
          "Allowance should not be less than deposit"
        );
      });

      it("should provide the principal to the beneficiary", async () => {
        const balanceAfter = await ethers.provider.getBalance(beneficiary);
        const diff = balanceAfter.sub(beneficiaryBalanceBefore);
        assert.equal(diff.toString(), deposit.toString());
      });

      it("should transfer interest to the depositor", async () => {
        const balanceAfter = await ethers.provider.getBalance(depositor);
        const diff = balanceAfter.sub(depositorBalanceBefore);
        assert(
          diff.gt(0),
          "expected interest to be sent to the original depositor"
        );
      });
    });
  });
});
