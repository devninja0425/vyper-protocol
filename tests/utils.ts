import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { createMintAndVault, createTokenAccount, getTokenAccount, sleep } from "@project-serum/common";
import { ASSOCIATED_TOKEN_PROGRAM_ID, MintLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { VyperCoreLending } from "../target/types/vyper_core_lending";
import { JUNIOR, SENIOR } from "./constants";

export function printProgramShortDetails(p: Program) {
  console.log(p.idl.name + ": " + p.programId);
}

export function printObjectKeys(title: string, obj: any) {
  console.log(title);
  var keys = Object.keys(obj);
  keys.forEach((k) => {
    console.log(k + ": " + (obj as any)[k]);
  });
  console.log();
}

export async function findAssociatedTokenAddress(
  walletAddress: anchor.web3.PublicKey,
  tokenMintAddress: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
}

export function bn(v: number): anchor.BN {
  return new anchor.BN(v);
}

export function to_bps(v: number): number {
  if (v > 1 || v < 0) throw Error("input needs to be between 0 and 1");
  return v * 10000;
}

export function from_bps(v: number): number {
  if (v > 10000 || v < 0) throw Error("input needs to be between 0 and 10000");
  return v / 10000;
}

export async function createDepositConfiguration(
  quantity: number,
  program: Program<VyperCoreLending>
): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
  const [depositMint, depositGod] = await createMintAndVault(
    program.provider,
    bn(quantity),
    program.provider.wallet.publicKey,
    0
  );
  const depositFromAccount = await findAssociatedTokenAddress(program.provider.wallet.publicKey, depositMint);

  const createDepositFromAccountTx = new anchor.web3.Transaction();
  createDepositFromAccountTx.add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      depositMint,
      depositFromAccount,
      program.provider.wallet.publicKey,
      program.provider.wallet.publicKey
    ),
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      depositGod,
      depositFromAccount,
      program.provider.wallet.publicKey,
      [],
      quantity
    )
  );
  await program.provider.send(createDepositFromAccountTx);

  return [depositMint, depositFromAccount];
}

export async function createMint(provider: anchor.Provider): Promise<anchor.web3.PublicKey> {
  const mintKP = anchor.web3.Keypair.generate();
  const mint = mintKP.publicKey;

  const tx = new anchor.web3.Transaction();
  tx.add(
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint,
      space: MintLayout.span,
      lamports: await Token.getMinBalanceRentForExemptMint(provider.connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mint, 0, provider.wallet.publicKey, provider.wallet.publicKey)
  );
  await provider.send(tx, [mintKP]);

  return mint;
}

export async function createUserAndTokenAccount(
  mint: anchor.web3.PublicKey,
  quantity: number,
  provider: anchor.Provider
): Promise<[anchor.web3.Keypair, anchor.web3.PublicKey]> {
  const userKP = anchor.web3.Keypair.generate();

  // await provider.connection.requestAirdrop(userKP.publicKey, 10);
  // do {
  //   await sleep(1000);
  // } while ((await provider.connection.getBalance(userKP.publicKey)) == 0);

  const userTokenAccount = await findAssociatedTokenAddress(userKP.publicKey, mint);

  const tx = new anchor.web3.Transaction();
  tx.add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      userTokenAccount,
      userKP.publicKey,
      userKP.publicKey
    ),
    Token.createMintToInstruction(TOKEN_PROGRAM_ID, mint, userTokenAccount, provider.wallet.publicKey, [], quantity)
  );
  await provider.send(tx, [userKP]);

  return [userKP, userTokenAccount];
}

// export function createMintAndDepositSource(
//   provider: anchor.Provider,
//   quantity: number
// ): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
//   return createMintAndDepositSourceWithOwner(provider, provider.wallet.publicKey, quantity);
// }

// export async function createMintAndDepositSourceWithOwner(
//   provider: anchor.Provider,
//   tokenAccountOwner: anchor.web3.PublicKey,
//   quantity: number
// ): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
//   // * * * * * * * * * * * * * * * * * * * * * * *
//   // create mint

//   const mint = await createMint(provider);

//   // * * * * * * * * * * * * * * * * * * * * * * *
//   // define user and user's token account

//   // const depositSourceAccount = await findAssociatedTokenAddress(tokenAccountOwner, mint);
//   // const mintToTx = new anchor.web3.Transaction();
//   // mintToTx.add(
//   //   Token.createAssociatedTokenAccountInstruction(
//   //     ASSOCIATED_TOKEN_PROGRAM_ID,
//   //     TOKEN_PROGRAM_ID,
//   //     mint,
//   //     depositSourceAccount,
//   //     provider.wallet.publicKey,
//   //     provider.wallet.publicKey
//   //   ),
//   //   Token.createMintToInstruction(TOKEN_PROGRAM_ID, mint, depositSourceAccount, provider.wallet.publicKey, [], quantity)
//   // );
//   // await provider.send(mintToTx);

//   await createTokenAccount(provider, mint);

//   return [mint, depositSourceAccount];
// }

// export async function findAndCreateAssociatedTokenAddress(
//   provider: anchor.Provider,
//   mint: anchor.web3.PublicKey
// ): Promise<anchor.web3.PublicKey> {
//   const atokenAccount = await findAssociatedTokenAddress(provider.wallet.publicKey, mint);

//   const createATokenAccount = new anchor.web3.Transaction();
//   createATokenAccount.add(
//     Token.createAssociatedTokenAccountInstruction(
//       ASSOCIATED_TOKEN_PROGRAM_ID,
//       TOKEN_PROGRAM_ID,
//       mint,
//       atokenAccount,
//       provider.wallet.publicKey,
//       provider.wallet.publicKey
//     )
//   );
//   await provider.send(createATokenAccount);

//   return atokenAccount;
// }
