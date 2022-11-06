export interface Dictionary<T> {
    [key: string]: T;
}

export interface KitsIsMaliciousResponse {
    "success" : boolean,
    results: Array<{
        status: "fulfilled",
        value: {
            alchemy: false | Dictionary<string>,
            chainabuse: false | Dictionary<string>,
            cryptoscamdb: false | Dictionary<string>,
            etherscan: false | Dictionary<string>,
            mew: false | Dictionary<string>,
            scanblocks: false | Dictionary<string>,
            sdn: false | Dictionary<string>,
            tokenblacklists: false | Dictionary<string>,
        }
    }>
}

export interface FortaDataParams {
    customVariables?: Dictionary<any>;
    address: string;
}

export interface TrustScoreDataParams {
    address: string;
    apikey: string;
}

export interface IsMaliciousParams {
    address: string;
    apikey: string;
}
