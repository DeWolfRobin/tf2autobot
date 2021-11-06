import { OptionsWithUrl, ResponseAsJSON } from 'request';

import request from 'request-retry-dayjs';
import { PricerOptions } from '../../../classes/IPricer';

export interface PricesCurrency {
    keys: number;
    metal: number;
}

export interface PricesResponse {
    success: boolean;
    message?: string;
}

export interface PricesGetItemPriceResponse extends PricesResponse {
    sku?: string;
    name?: string;
    currency?: string;
    source?: string;
    time?: number;
    buy?: PricesCurrency;
    sell?: PricesCurrency;
    message?: string;
}

export interface PricesGetPricelistResponse extends PricesResponse {
    currency?: string | null;
    items?: PricesItem[];
}

export interface PricesItem {
    sku: string;
    name: string;
    source: string;
    time: number;
    buy: PricesCurrency | null;
    sell: PricesCurrency | null;
}

export interface PricesItemMessageEvent {
    type: string;
    data: PricesItem;
}

export interface PricesGetItemPriceResponse extends PricesResponse {
    sku?: string;
    name?: string;
    currency?: string;
    source?: string;
    time?: number;
    buy?: PricesCurrency;
    sell?: PricesCurrency;
    message?: string;
}

export interface PricesSale {
    id: string;
    steamid: string;
    automatic: boolean;
    attributes: any;
    intent: number;
    currencies: PricesCurrency;
    time: number;
}

export interface PricesRequestCheckResponse extends PricesResponse {
    sku: string;
    name: string;
}

export default class CustomPricerApi {
    public constructor(public url?: string, public apiToken?: string) {}

    private apiRequest<I, R extends PricesResponse>(httpMethod: string, path: string, input: I): Promise<R> {
        const options: OptionsWithUrl & { headers: Record<string, unknown> } = {
            method: httpMethod,
            url: `${this.url ? this.url : 'https://api.prices.tf'}${path}`,
            headers: {
                // This one is okay to keep I guess
                'User-Agent': 'TF2Autobot@' + process.env.BOT_VERSION
            },
            json: true,
            gzip: true,
            timeout: 30000
        };

        if (this.apiToken) {
            options.headers.Authorization = `Token ${this.apiToken}`;
        }

        options[httpMethod === 'GET' ? 'qs' : 'body'] = input;

        return new Promise((resolve, reject) => {
            void request(options, (err, response: ResponseAsJSON, body: R) => {
                if (err) {
                    reject(err);
                }

                resolve(body);
            });
        });
    }

    requestCheck(sku: string): Promise<PricesRequestCheckResponse> {
        return this.apiRequest('POST', `/items/${sku}`, { source: 'bptf' });
    }

    getPrice(sku: string): Promise<PricesGetItemPriceResponse> {
        return this.apiRequest('GET', `/items/${sku}`, { src: 'bptf' });
    }

    getPricelist(): Promise<PricesGetPricelistResponse> {
        return this.apiRequest('GET', '/items', { src: 'bptf' });
    }

    getOptions(): PricerOptions {
        return {
            pricerUrl: this.url,
            pricerApiToken: this.apiToken
        };
    }
}