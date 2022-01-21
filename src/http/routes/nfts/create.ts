import { database } from "../../../prisma";
import RouteExecutor from "../../classes/RouteExecutor";

const route = new RouteExecutor({
    path: '/nfts/create',
    method: 'POST'
})


route.setExecutor(async (server, request, response) => {
    await database.nft.create({
        data: {
            deposit: request.body.deposit,
            yield: request.body.yield,
        }
    }).then(async (nft) => {
        console.log(nft);
        await database.nftReference.create({
            data: {
                nftId: nft.id,
                tokenId: request.body.tokenId,
                contractAddress: request.body.contractAddress
            }
        });

        return route.reply(response, 'Created');
    })

})

export default route;

