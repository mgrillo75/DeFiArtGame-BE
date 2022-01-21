import { database } from "../../../prisma";
import RouteExecutor from "../../classes/RouteExecutor";

const route = new RouteExecutor({
    path: '/nfts/get',
    method: 'GET'
})


route.setExecutor(async (server, request, response) => {
    const nfts = await database.nft.findMany({ include: { reference: true } });
    route.reply(response, nfts);
})

export default route;

