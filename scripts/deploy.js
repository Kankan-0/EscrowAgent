const hre = require("hardhat");

const main = async () => {
  [depositor, arbiter, beneficiary] = await hre.ethers.getSigners();
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(arbiter.address, beneficiary.address);
  await escrow.deployed();

  console.log("Deployed at : ", escrow.address);
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
