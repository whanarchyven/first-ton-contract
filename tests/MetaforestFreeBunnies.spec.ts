import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MetaforestFreeBunnies } from '../wrappers/MetaforestFreeBunnies';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MetaforestFreeBunnies', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MetaforestFreeBunnies');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let metaforestFreeBunnies: SandboxContract<MetaforestFreeBunnies>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        metaforestFreeBunnies = blockchain.openContract(MetaforestFreeBunnies.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await metaforestFreeBunnies.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: metaforestFreeBunnies.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and metaforestFreeBunnies are ready to use
    });
});
