// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { Wrapper, Separator } from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Identicon from '../../library/Identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Wallets } from './Wallets';

export const ConnectAccounts = () => {

  const modal = useModal();

  const { config } = modal;
  const _section = config?.section ?? null;

  const {
    getAccount,
    connectToAccount,
    disconnectFromAccount,
    activeWallet,
    activeAccount,
  }: any = useConnect();

  let { accounts } = useConnect();

  const activeAccountMeta = getAccount(activeAccount);

  // active section of modal
  const [section, setSection] = useState(
    _section !== null ? _section : activeAccount !== null ? 1 : 0
  );

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  // back to wallet section if none active
  useEffect(() => {
    if (activeWallet === null) {
      setSection(0);
    }
  }, [activeWallet]);

  return (
    <Wrapper>
      {section === 0 && <Wallets setSection={setSection} />}

      {section === 1 &&
        <>
          <h2>{activeAccount === '' ? 'Connect' : 'Switch'} Account</h2>
          <div className='head'>
            <button onClick={() => setSection(0)}>
              <FontAwesomeIcon icon={faChevronLeft} transform="shrink-5" />
              &nbsp;Back to Wallets
            </button>
          </div>

          {activeAccount !== ''
            ?
            <button className='item' onClick={() => { disconnectFromAccount(); }}>
              <div>
                <Identicon value={activeAccountMeta?.address} size={26} />
                &nbsp; {activeAccountMeta?.meta?.name}
              </div>
              <div className='danger'>Disconnect </div>
            </button>
            : <button className='item' disabled>
              <div>No Account Connected</div>
              <div></div>
            </button>
          }
          <Separator />

          {accounts.map((item: any, index: number) => {

            const { address, meta } = item;
            const { name } = meta;

            return (
              <button className='item' key={`switch_acnt_${index}`} onClick={() => {
                connectToAccount(item);
                modal.setStatus(2);
              }}>
                <div>
                  <Identicon value={address} size={26} />
                  &nbsp; {name}
                </div>
                <div>
                </div>
              </button>
            );
          })}
        </>
      }
    </Wrapper>
  )
}

export default ConnectAccounts;