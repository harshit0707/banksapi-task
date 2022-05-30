import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ValidatorService } from 'angular-iban';
import { AppState } from 'src/app/state/app.state';
import { getTransfers, setTransfersList, removeTransfer, addTransfer, editTransfer } from 'src/app/state/transfers.actions';
import { Transfer } from '../../models/transfer.model';
import { TransfersService } from '../../services/transfers.service';

import * as moment from 'moment';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss'],
})
export class TransfersComponent implements OnInit {

  contentReady = false;
  errorMessage = '';
  tableData: Array<Transfer>;

  filterValue = '';
  transferForm: FormGroup;
  saveAttempt = false;
  addSession = false;
  editSession = false;
  editId = '';
  sortValue = '';

  constructor(
    private store: Store<AppState>,
    private transferService: TransfersService
  ) {
    const pattern = /(^(([1]\d{0,1})|([2][0])|[1-9])(?:\.\d{3}){2}(?:,\d{0,2})?$)|(^[1-9]\d{0,2}(?:\.\d{3}){1}(?:,\d{0,2})?$)|(^(([1-9][0-9]{2})|([5-9][0-9]))(?:,\d{0,2})?$)/;
    this.transferForm = new FormGroup({
      id: new FormControl(''),
      accountName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      date: new FormControl('', [Validators.required]),
      iban: new FormControl('', [Validators.required, ValidatorService.validateIban]),
      amount: new FormControl('', [Validators.required, Validators.pattern(pattern)]),
      note: new FormControl('', [Validators.required, Validators.maxLength(100)])
    })
  }

  ngOnInit() {
    this.initializeTableData();
    this.transferService.getTransfers().subscribe((data) => {
      if (data && data.length>0) {
        this.store.dispatch(setTransfersList({transfers: data}));
      } else {
        this.errorMessage = 'No data available';
      }
    }, (error) => {
      this.errorMessage = 'Unable to load transfers. Please try again later!';
    });
  }

  initializeTableData() {
    this.store.select('transfers').subscribe(data => {
      if (data.length >= 0) {
        this.tableData = data.filter((entry) => 
          (entry.accountName.toLowerCase().indexOf(this.filterValue) >= 0) || 
          (entry.note.toLowerCase().indexOf(this.filterValue) >= 0));
        if (this.sortValue) this.sort();
        this.contentReady = true;
      }
    });
  }

  clearFilter() {
    this.filterValue = '';
    this.store.dispatch(getTransfers());
  }

  updateFilter(event: Event) {
    this.filterValue = (event as CustomEvent).detail.value.toLowerCase();
    this.store.dispatch(getTransfers());
  }

  deleteEntry(id: string) {
    this.tableData.forEach(entry => {
      if (entry.id === id) {
        this.store.dispatch(removeTransfer({transfer: entry}));
        return;
      }
    })
  }

  editEntry(data: Transfer) {
    this.transferForm.reset();
    this.editId = data.id;
    this.editSession = true;
    let formData = JSON.parse(JSON.stringify(data));
    formData.date = this.formatDateBeforeEdit(formData.date);
    this.transferForm.setValue(formData);
  }

  saveEdit() {
    this.saveAttempt = true;
    if (this.transferForm.valid) {
      this.formatDateBeforeSave();
      let entry: Transfer = this.transferForm.value;
      entry.id = this.editId;
      this.store.dispatch(editTransfer({transfer: entry}));
      this.cancelEdit()
    }
  }

  addEntry() {
    this.addSession = true;
  }

  add() {
    this.saveAttempt = true;
    if (this.transferForm.valid) {
      this.formatDateBeforeSave();
      let entry: Transfer = this.transferForm.value;
      entry.id = '_' + Math.random().toString(36).slice(2, 9);
      this.store.dispatch(addTransfer({transfer: entry}));
      this.cancelAdd();
    }
  }

  cancelAdd() {
    this.transferForm.reset();
    this.saveAttempt = false;
    this.addSession = false;
  }

  cancelEdit() {
    this.editId = '';
    this.saveAttempt = false;
    this.transferForm.reset();
    this.editSession = false;
  }

  getErrorMessage(control: string): string {
    if ( this.transferForm.get(control).valid ||
      (this.transferForm.get(control).pristine &&
      !this.saveAttempt)) {
      return '';
    }
    let errorMessage = '';
    if (control === 'accountName') {
      errorMessage = 'Please enter minimum 1 and a maximum of 100 characters';
    } else if (control === 'date') {
      errorMessage = 'Please enter a date in the format dd.mm.yyyy';
    } else if (control === 'iban') {
      errorMessage = 'Please enter a valid IBAN';
    } else if (control === 'amount') {
      errorMessage = 'Please enter amount between 50 and 20.000.000 with maximum 2 decimal places';
    } else if (control === 'note') {
      errorMessage = 'Please enter minimum 1 and a maximum of 100 characters';
    }
    return errorMessage;
  }

  getMinDate() {
    let tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
    return tomorrow;
  }

  formatDateBeforeSave() {
    let currentValue = this.transferForm.get('date').value;
    const date = moment(currentValue).format('DD.MM.YYYY');
    this.transferForm.get('date').setValue(date);
  }

  formatDateBeforeEdit(date: string) {
    return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD');
  }

  sort() {
    if (this.sortValue === '') this.store.dispatch(getTransfers());
    else if (this.sortValue === 'DateDescending') this.tableData.sort((a,b) => moment(b.date, 'DD.MM.YYYY').unix() - moment(a.date, 'DD.MM.YYYY').unix());
    else if (this.sortValue === 'DateAscending') this.tableData.sort((a,b) => moment(a.date, 'DD.MM.YYYY').unix() - moment(b.date, 'DD.MM.YYYY').unix());
    else if (this.sortValue === 'AmountDescending') this.tableData.sort((a,b) => parseFloat(this.formatAmount(b.amount)) - parseFloat(this.formatAmount(a.amount)));
    else if (this.sortValue === 'AmountAscending') this.tableData.sort((a,b) => parseFloat(this.formatAmount(a.amount)) - parseFloat(this.formatAmount(b.amount)));
  }

  formatAmount(amount: string) {
    amount = amount.replace('.', '');
    amount = amount.replace(',', '.');
    return amount;
  }
}
