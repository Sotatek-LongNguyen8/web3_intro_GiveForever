const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GiveForever", function () {
  let giveForever, lidoMock, owner;

  before(async () => {
    [owner] = await ethers.getSigners();
    let LidoMock = await ethers.getContractFactory("LidoMock");
    lidoMock = await LidoMock.deploy();

    let GiveForever = await ethers.getContractFactory("GiveForever");
    giveForever = await GiveForever.deploy(owner.address, lidoMock.address);
  });

  it("Should return a charity address", async function () {
    let tx1 = await giveForever.charity();
    expect(tx1).to.be.eq(owner.address);
  });

  it("Should return the lido contract address", async function () {
    const tx1 = await giveForever.lidoAddress();
    expect(tx1).to.be.eq(lidoMock.address);
  });

  it("should accept ETH deposit", async function () {
    const donated1 = await giveForever.donated();
    const ethAmount = ethers.utils.parseEther("0.01");
    await giveForever.deposit({ value: ethAmount });
    const donated2 = await giveForever.donated();
    expect(donated2).to.be.gt(donated1);
  });

  it("should show lido balance", async function () {
    const balance = await giveForever.lidoBalance();
    expect(balance).to.be.gt(0);
  });

  it("should withdraw ETH to charity address", async function () {
    const balance1 = await giveForever.lidoBalance();
    await giveForever.withdraw();
    const balance2 = await giveForever.lidoBalance();
    expect(balance2).to.be.lt(balance1);
  });

  it("charity should be able to update address", async function () {
    const charityAddress = "0xFfFA40917e5Ebf6e0a51aD4a1272834dd2b200f0";
    await giveForever.updateWallet(charityAddress);
    const charity = await giveForever.charity();
    expect(charity).to.be.eq(charityAddress);
  });
});
