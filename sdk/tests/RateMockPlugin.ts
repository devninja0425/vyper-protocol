import * as anchor from "@project-serum/anchor";
import { PublicKey, } from "@solana/web3.js";
import * as dotenv from 'dotenv';
import { assert, expect} from "chai";
import { RateMockPlugin } from '../src/plugins/ratePlugin/rateMock/RateMock';

dotenv.config();

const rateMockPluginId = new PublicKey('FB7HErqohbgaVV21BRiiMTuiBpeUYT8Yw7Z6EdEL7FAG');

describe('Rate Mock Plugin', () => {

    const provider = anchor.AnchorProvider.env();
    const rateMockPlugin = RateMockPlugin.create(provider, rateMockPluginId);

    it('fetch existing rate mock state', async () => {
        const accounts = await provider.connection.getProgramAccounts(rateMockPluginId);
        const rateState = await rateMockPlugin.getRateMockPluginState(accounts[0].pubkey);
        
        assert.ok(rateState.fairValue != undefined);
        assert.ok(rateState.refreshedSlot != undefined);
    })

    it('set mock rate', async () => {
        const accounts = await provider.connection.getProgramAccounts(rateMockPluginId);
        rateMockPlugin.rateMockStateId=accounts[0].pubkey;
        let rateState = await rateMockPlugin.getRateMockPluginState();
        
        // with direct rpc call
        await rateMockPlugin.setFairValue(1500);
        rateState = await rateMockPlugin.getRateMockPluginState();
        expect(rateState.fairValue[0]).to.eq(1500);

        // with setFairValueIX
        const tx = new anchor.web3.Transaction();
        const instruction = await rateMockPlugin.getSetFairValueIX(2500);
        tx.add(instruction);
        await provider.sendAndConfirm(tx);

        rateState = await rateMockPlugin.getRateMockPluginState();
        expect(rateState.fairValue[0]).to.eq(2500);
    })

}); 