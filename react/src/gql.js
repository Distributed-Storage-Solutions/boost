import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import {WebSocketLink} from "apollo-link-ws";
import {InMemoryCache} from "apollo-cache-inmemory";
import {parseDates} from "./hooks";

const cache = new InMemoryCache();

const gqlClient = new ApolloClient({
    link: new WebSocketLink({
        uri: "ws://localhost:8080/graphql",
        options: {
            reconnect: true,
        },
    }),
    cache
});

const gqlQuery = function(...args) {
    var res = gqlClient.query.apply(gqlClient, args)
    return res.then(ret => {
        if (ret.data) {
            parseDates(ret.data)
        }
        return ret
    })
}

const gqlSubscribe = function(...args) {
    return gqlClient.subscribe.apply(gqlClient, args)
}

const DealsListQuery = gql`
    query AppDealsListQuery($first: ID, $limit: Int) {
        deals(first: $first, limit: $limit) {
            deals {
                ID
                CreatedAt
                PieceCid
                PieceSize
                ClientAddress
                Message
                Logs {
                    CreatedAt
                    Text
                }
            }
            totalCount
            next
        }
    }
`;

const DealSubscription = gql`
    subscription AppDealSubscription($id: ID!) {
        dealUpdate(id: $id) {
            ID
            CreatedAt
            PieceCid
            PieceSize
            ClientAddress
            Message
            Logs {
                CreatedAt
                Text
            }
        }
    }
`;

const DealCancelMutation = gql`
    mutation AppDealCancelMutation($id: ID!) {
        dealCancel(id: $id)
    }
`;

const NewDealsSubscription = gql`
    subscription AppNewDealsSubscription {
        dealNew {
            ID
            CreatedAt
            PieceCid
            PieceSize
            ClientAddress
            Message
            Logs {
                CreatedAt
                Text
            }
        }
    }
`;

const StorageQuery = gql`
    query AppStorageQuery {
        storage {
            Name
            Capacity
            Used
        }
    }
`;

const FundsQuery = gql`
    query AppFundsQuery {
        funds {
            Name
            Capacity
        }
    }
`;

export {
    gqlClient,
    gqlQuery,
    gqlSubscribe,
    DealsListQuery,
    DealSubscription,
    DealCancelMutation,
    NewDealsSubscription,
    StorageQuery,
    FundsQuery,
}