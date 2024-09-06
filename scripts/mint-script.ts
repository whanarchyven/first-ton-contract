import {address, Address, beginCell, Cell, toNano} from '@ton/core';
import {compile, NetworkProvider} from '@ton/blueprint';
import {NftCollectionDeploy} from "../wrappers/nftCollectionDeploy";


export async function run(provider: NetworkProvider) {
    const address = Address.parse('EQCHY68ZBiHpy4ePv-mnoLu6gFLQ_SeG9BoKNZu3In6OtfZY')
    const minterForNft: any = provider.open(NftCollectionDeploy.createFromAddress(address))
    await minterForNft.mintNFT(provider.sender(), {
        value: toNano('0.2'), amount: toNano('0.01'),
        to_address: provider.sender().address,
        item_owner_address: provider.sender().address,
        item_index: 0,
        content_url: 'https://raw.githubusercontent.com/whanarchyven/ton-connect-manifest/main/metadatat.json',
        query: 0
    })
}