import { createReducer, on } from '@ngrx/store';

import { Transfer } from '../home/models/transfer.model';
import { addTransfer, editTransfer, getTransfers, setTransfersList, removeTransfer } from './transfers.actions';

export const initialState: Array<Transfer> = [];

export const transfersReducer = createReducer(
  initialState,
  on(setTransfersList, (initialState, { transfers }) => transfers),
  on(removeTransfer, (initialState, { transfer }) => initialState.filter((entity) => entity.id !== transfer.id)),
  on(addTransfer, (initialState, { transfer }) => {
    return [...initialState, transfer];
  }),
  on(editTransfer, (initialState, { transfer }) => {
    let newState = initialState.map(entity => {
      if (entity.id === transfer.id) {
        return transfer;
      } else {
        return entity;
      }
    })
    return [...newState];
  }),
  on(getTransfers, (initialState, {}) => { return [...initialState] }),
);