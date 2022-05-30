import { createAction, props } from '@ngrx/store';
import { Transfer } from '../home/models/transfer.model';

 
export const addTransfer = createAction(
  '[Transfer List] Add Transfer',
  props<{ transfer: Transfer }>()
);
 
export const removeTransfer = createAction(
  '[Transfer List] Remove Transfer',
  props<{ transfer: Transfer }>()
);

export const editTransfer = createAction(
  '[Transfer List] Edit Transfer',
  props< { transfer: Transfer }>()
)

export const getTransfers = createAction(
  '[Transfer List] Filter Transfer'
)

export const setTransfersList = createAction(
  '[Transfer List] Get Transfers',
  props<{ transfers: Array<Transfer> }>()
);