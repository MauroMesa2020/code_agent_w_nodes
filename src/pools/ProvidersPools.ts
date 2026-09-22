// Aramar un array con los providers, marcando si han estado disponibles en los ultimos 40 minutos. 

import type { IProvider } from "../llm/IProvider.js";

// Ver que onda, para mi parece funcionar, La idea es que se pueda setear el Provider.

interface ProvidersMetadata{
    time_available: Date;
    is_available: boolean;
    provider: IProvider;
}

export class ProvidersPools{
    private _providers: ProvidersMetadata[] = [];

    constructor(providers: ProvidersMetadata[]){
        this._providers = providers;
    }

    getProviders(){
        return this._providers;
    }

    setProvider(p: ProvidersMetadata, is_available: boolean, time_available: Date){
        p.is_available = is_available;
        p.time_available = time_available;
    }
    private isAvailable(p: ProvidersMetadata): boolean{

        if (p.is_available || new Date().getTime() - p.time_available.getTime() > 30000){
            // Aca podria armar otra funcion que sea: is_available_now. y preguntar a la api del povider. 
            this.setProvider(p, true, new Date()); 
            return true;
        }

        return false;
    }

    addProvider(p: ProvidersMetadata){
        this._providers.push(p);
    }

    getProviderAvailable(){
        for (const p of this._providers){
            if (this.isAvailable(p)){
                return p.provider;
            }
        }
        return null;
    }
    
}