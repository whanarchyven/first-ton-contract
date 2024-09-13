import {Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode} from "@ton/core";

export class NftCollectionDeploy implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {

    }

    static createFromAddress(address: Address) {
        return new NftCollectionDeploy(address)
    }

    static createFromConfig(config: cellConfig, code: Cell, workchain = 0) {
        const data = this.configToCell(config)
        const initialState = {
            code, data
        }
        const address_collection = contractAddress(workchain, initialState)
        console.log(address_collection)
        return new NftCollectionDeploy(address_collection, initialState)
    }

    async sendDeploy(provider: ContractProvider, sender: Sender, value: bigint) {
        await provider.internal(sender, {value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: beginCell().endCell()})
    }

    static configToCell(config: cellConfig) {
        return beginCell().storeAddress(config.owner_address).storeUint(config.next_item_index, 8).storeRef(config.content).storeRef(config.nft_item_code).storeRef(config.royalty).endCell()
    }

    async sendMint(provider: ContractProvider, sender: Sender, opts: {
        value: bigint;
        to_address: Address;
        item_owner_address: Address;
        item_index: number;
        amount: bigint;
        content_url: string;
        query: number
    }) {
        const url_content = beginCell().storeBuffer(Buffer.from(opts.content_url)).endCell()
        const ref = beginCell().storeAddress(opts.item_owner_address).storeRef(url_content).endCell()

        await provider.internal(sender, {
            value: opts.value, sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(opts.query, 64).storeUint(opts.item_index, 64).storeCoins(opts.amount).storeRef(ref).endCell()
        })
    }

}

type cellConfig = {
    owner_address: Address,
    next_item_index: number,
    content: Cell,
    nft_item_code: Cell,
    royalty: Cell,
}

