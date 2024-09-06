import {address, Address, beginCell, Cell, toNano} from '@ton/core';
import {compile, NetworkProvider} from '@ton/blueprint';
import {NftCollectionDeploy} from "../wrappers/nftCollectionDeploy";


const base_64_nft_preset = 'te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu'

export async function run(provider: NetworkProvider) {

    const content_url = 'https://raw.githubusercontent.com/whanarchyven/ton-connect-manifest/main/metadatat.json'
    const content_url_temp = ''
    const content_cell = beginCell()
    let value: any = Buffer.concat([Buffer.from([0x01]), Buffer.from(content_url)])
    let pieces: Array<Buffer> = []
    while (value.byteLength > 0) {
        pieces.push(value.subarray(0, 127))
        value = value.subarray(127)
    }

    let cell1=beginCell()

    for(let i=pieces.length-1;i>=0;i--){
        const piece=pieces[i]
        cell1.storeBuffer(piece)
        if(i-1>=0){
            cell1=beginCell().storeRef(cell1)
        }
    }
    cell1.endCell()

    const collection_content=cell1
    const content1=beginCell().storeBuffer(Buffer.from(content_url_temp))
    content_cell.storeRef(collection_content).storeRef(content1.endCell())


    const owner_wallet_address: Address = Address.parse('UQArOJLsRm3YUtbf7qy9P5Cl-2po04yVxZczZqGsROMjBjMH')
    const next_item = 0

    console.log('ENTERED')
    const content = nftContentToCell({type: 0, uri: content_url})


    // await metaforestFreeBunnies.sendDeploy(provider.sender(), toNano('0.05'));
    //
    // await provider.waitForDeploy(metaforestFreeBunnies.address);

    const nftItemCodeCell = Cell.fromBase64(base_64_nft_preset)


    const royalty_base = 1000
    const royalty_percent = 20

    const royalty_factor = Math.floor(royalty_percent * royalty_base)

    const royalty_cell = beginCell().storeUint(royalty_factor, 16).storeUint(royalty_base, 16).storeAddress(owner_wallet_address).endCell()

    const nft_collection_deployer = provider.open(NftCollectionDeploy.createFromConfig({
        owner_address: owner_wallet_address,
        nft_item_code: nftItemCodeCell,
        next_item_index: next_item,
        content: content_cell.endCell(),
        royalty: royalty_cell
    }, await
        compile('MetaforestFreeBunnies')))


    await nft_collection_deployer.sendDeploy(provider.sender(), toNano('0.05'))

    await provider.waitForDeploy(nft_collection_deployer.address, 20, 5000)

    // run methods on `metaforestFreeBunnies`

}

type nftCollectionContent = { type: 0 | 1, uri: string }

export function nftContentToCell(content: nftCollectionContent) {
    return beginCell().storeUint(content.type, 8).storeStringTail(content.uri).endCell()
}
