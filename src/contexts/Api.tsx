// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  CONNECTION_STATUS,
  BONDING_DURATION,
  SESSIONS_PER_ERA,
  MAX_NOMINATOR_REWARDED_PER_VALIDATOR,
  MAX_NOMINATIONS,
  API_ENDPOINTS,
  NODE_ENDPOINTS,
} from '../constants';

type NetworkOptions = 'polkadot' | 'westend';

export const APIContext: any = React.createContext({
  connect: () => { },
  fetchDotPrice: () => { },
  switchNetwork: () => { },
  api: null,
  consts: {},
  isReady: false,
  status: CONNECTION_STATUS[0],
});

export const useApi = () => React.useContext(APIContext);

export const APIProvider = (props: any) => {

  // default state
  const defaultNetwork: any = {
    name: localStorage.getItem('network'),
    meta: NODE_ENDPOINTS[localStorage.getItem('network') as keyof NetworkOptions],
  };

  // default consts
  const defaultConsts = {
    bondDuration: 0,
    maxNominations: 0,
    sessionsPerEra: 0,
    maxNominatorRewardedPerValidator: 0,
    maxElectingVoters: 0,
  };

  // provider instance state
  const [provider, setProvider]: any = useState(null);

  // api instance state
  const [api, setApi]: any = useState(null);

  // network state
  const [network, setNetwork]: any = useState(defaultNetwork);

  // constants state
  const [consts, setConsts]: any = useState(defaultConsts);

  // connection status state
  const [connectionStatus, setConnectionStatus]: any = useState(CONNECTION_STATUS[0]);

  useEffect(() => {
    const network: any = localStorage.getItem('network');
    connect(network);
  }, []);

  useEffect(() => {
    if (provider !== null) {
      // provider.on('connected', () => {});
      // provider.on('ready', () => {});
      // provider.on('error', () => {});
      // provider.on('disconnected', () => {});
    }
  }, [provider]);

  // connect to websocket and return api into context
  const connect = async (_network: keyof NetworkOptions) => {
    {
      setConnectionStatus(CONNECTION_STATUS[1]);
      setNetwork({
        name: _network,
        meta: NODE_ENDPOINTS[_network as keyof NetworkOptions],
      });
    }

    const _provider = new WsProvider(NODE_ENDPOINTS[_network].endpoint);
    const api = await ApiPromise.create({ provider: _provider });

    const _metrics = await Promise.all([
      api.consts.staking.bondingDuration,
      api.consts.staking.maxNominations,
      api.consts.staking.sessionsPerEra,
      api.consts.staking.maxNominatorRewardedPerValidator,
      api.consts.electionProviderMultiPhase.maxElectingVoters,
    ]);

    const bondDuration = _metrics[0] ? _metrics[0].toHuman() : BONDING_DURATION;
    const sessionsPerEra = _metrics[2] ? _metrics[2].toHuman() : SESSIONS_PER_ERA;
    const maxNominatorRewardedPerValidator = _metrics[3] ? _metrics[3].toHuman() : MAX_NOMINATOR_REWARDED_PER_VALIDATOR;
    const maxNominations = _metrics[1] ? _metrics[1].toHuman() : MAX_NOMINATIONS;
    let maxElectingVoters: any = _metrics[4];
    maxElectingVoters = maxElectingVoters?.toNumber();

    localStorage.setItem('network', String(_network));

    {
      setProvider(_provider);
      setApi(api);
      setNetwork({
        name: _network,
        meta: NODE_ENDPOINTS[_network as keyof NetworkOptions],
      });
      setConsts({
        bondDuration: bondDuration,
        maxNominations: maxNominations,
        sessionsPerEra: sessionsPerEra,
        maxNominatorRewardedPerValidator: Number(maxNominatorRewardedPerValidator),
        maxElectingVoters: Number(maxElectingVoters),
      });
      setConnectionStatus(CONNECTION_STATUS[2]);
    }
  }

  // handle network switching
  const switchNetwork = async (_network: keyof NetworkOptions) => {
    if (_network !== network.name) {
      {
        setApi(null);
        setProvider(null);
        setNetwork(defaultNetwork);
        setConsts(defaultConsts);
        setConnectionStatus(CONNECTION_STATUS[0]);
      }
      connect(_network);
    }
  }

  // handles fetching of DOT price and updates context state.
  const fetchDotPrice = async () => {
    const urls = [
      `${API_ENDPOINTS.priceChange}${NODE_ENDPOINTS[network.name as keyof NetworkOptions].api.priceTicker}`,
    ];
    let responses = await Promise.all(urls.map(u => fetch(u, { method: 'GET' })))
    let texts = await Promise.all(responses.map(res => res.json()));
    const _change = texts[0];

    if (_change.lastPrice !== undefined && _change.priceChangePercent !== undefined) {
      let price: string = (Math.ceil(_change.lastPrice * 100) / 100).toFixed(2);
      let change: string = (Math.round(_change.priceChangePercent * 100) / 100).toFixed(2);

      return {
        lastPrice: price,
        change: change,
      };
    }
  }

  return (
    <APIContext.Provider value={{
      connect: connect,
      fetchDotPrice: fetchDotPrice,
      switchNetwork: switchNetwork,
      api: api,
      consts: consts,
      isReady: (connectionStatus === CONNECTION_STATUS[2] && api !== null),
      network: network.meta,
      status: connectionStatus,
    }}>
      {props.children}
    </APIContext.Provider>
  );
}