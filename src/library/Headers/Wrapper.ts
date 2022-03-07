// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from "framer-motion";
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-flow: row nowrap;
  padding: 0.75rem  1rem; 
  transition: all 0.15s;
  z-index: 5;

  /* overwrite default cursor behaviour for Identicon  */
  svg, .ui--IdentityIcon {
    cursor: default;
  }
`;

export const HeadingWrapper = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  margin-left: 0.75rem;
  position: relative;

  &:first-child {
    margin-left: 0;
  }

  /* accounts dropdown */
  .accounts {
    position: absolute;
    border-radius: 1rem;
    background: rgba(225,225,225,0.5);
    backdrop-filter: blur(4px);
    top: 3rem;
    right: 0;
    width: 100%;
    min-width: 250px;
    list-style: none;
    margin: 0;
    padding: 0rem 0.25rem;
    display: flex;
    flex-flow: column wrap;
    box-sizing: border-box;
  }
`;

export const Item = styled(motion.button)`
    flex-grow: 1;  
    padding: 0rem 1rem;
    margin: 0.25rem 0;
    border-radius: 1rem;
    box-shadow: none;
    background: rgba(225,225,225,0.9);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-variation-settings: 'wght' 540;
    height: 2.3rem;
    font-size: 1rem;

    &.connect {
      background: #d33079;
      color: white;
    }
    .label {
      border: 0.125rem solid #d33079;
      border-radius: 0.8rem;
      color: #d33079;
      font-size: 0.85rem;
      font-variation-settings: 'wght' 525;
      margin-right: 0.6rem;
      padding: 0.1rem 0.5rem;
    }
`;

export default Wrapper;