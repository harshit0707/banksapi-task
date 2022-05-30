import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as moment from 'moment';
import { Transfer } from '../../models/transfer.model';
import { TransfersService } from '../../services/transfers.service';
import { TransfersComponent } from './transfers.component';

describe('TransfersComponent', () => {
  let component: TransfersComponent;
  let fixture: ComponentFixture<TransfersComponent>;

  let store: MockStore;
  const initialState = { transfers: [] };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfersComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers:[
        TransfersService,
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clearFilter() should work', () => {
    spyOn(store, 'dispatch');
    component.clearFilter();
    expect(component.filterValue).toBe('');
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('updateFilter() should work', () => {
    spyOn(store, 'dispatch');
    const event = new CustomEvent('ionChange', {detail: {value: 'A'}});
    component.updateFilter(event);
    expect(component.filterValue).toBe('a');
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('deleteEntry() should work', () => {
    const data: Transfer = {
      id: "1",accountName: "abc",iban: "abc",date: '535254',amount: "100",note: "abc"
    }
    component.tableData = [data];
    spyOn(store, 'dispatch');
    component.deleteEntry(data.id);
    expect(store.dispatch).toHaveBeenCalled();
  })

  it('editEntry() should work', () => {
    const data: Transfer = {
      id: "1",accountName: "abc",iban: "abc",date: '6435',amount: "100",note: "abc"
    }
    spyOn(component.transferForm, 'setValue');
    spyOn(component.transferForm, 'reset');
    component.editEntry(data);
    expect(component.editId).toBe(data.id);
    expect(component.editSession).toBeTruthy();
    expect(component.transferForm.setValue).toHaveBeenCalled();
    expect(component.transferForm.reset).toHaveBeenCalled();
  })

  it('saveEdit() should work', () => {
    component.transferForm.setValue({id: '',accountName: '',date: '',iban: '',amount: '',note: ''});
    component.saveEdit();
    expect(component.saveAttempt).toBeTruthy();
    component.transferForm.setValue({
      id: '1',
      accountName: 'abc',
      date: '25/05/2022',
      iban: 'DE75512108001245126199',
      amount: '100',
      note: 'abc'
    });
    spyOn(TransfersComponent.prototype, 'cancelEdit');
    spyOn(store, 'dispatch');
    component.saveEdit();
    expect(component.cancelEdit).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  })

  it('addEntry() should work', () => {
    component.addEntry();
    expect(component.addSession).toBeTruthy();
  })

  it('add() should work', () => {
    component.transferForm.setValue({id: '',accountName: '',date: '',iban: '',amount: '',note: ''});
    component.add();
    expect(component.saveAttempt).toBeTruthy();
    component.transferForm.setValue({
      id: '1',
      accountName: 'abc',
      date: '25/05/2022',
      iban: 'DE75512108001245126199',
      amount: '100',
      note: 'abc'
    });
    spyOn(TransfersComponent.prototype, 'cancelAdd');
    spyOn(store, 'dispatch');
    component.add();
    expect(component.cancelAdd).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  })

  it('cancelAdd() should work', () => {
    spyOn(component.transferForm, 'reset');
    component.cancelAdd();
    expect(component.saveAttempt).toBeFalsy();
    expect(component.addSession).toBeFalsy();
    expect(component.transferForm.reset).toHaveBeenCalled();
  })

  it('cancelEdit() should work', () => {
    spyOn(component.transferForm, 'reset');
    component.cancelEdit();
    expect(component.editId).toBe('');
    expect(component.saveAttempt).toBeFalsy();
    expect(component.editSession).toBeFalsy();
    expect(component.transferForm.reset).toHaveBeenCalled();
  })

  it('getErrorMessage() should work', () => {
    component.transferForm.setValue({id: '',accountName: '',date: '',iban: '',amount: '',note: ''});
    let message = component.getErrorMessage('accountName');
    expect(message).toBe('');
    component.saveAttempt = true;
    message = component.getErrorMessage('accountName');
    expect(message).toBe('Please enter minimum 1 and a maximum of 100 characters');
    message = component.getErrorMessage('date');
    expect(message).toBe('Please enter a date in the format dd.mm.yyyy');
    message = component.getErrorMessage('iban');
    expect(message).toBe('Please enter a valid IBAN');
    message = component.getErrorMessage('amount');
    expect(message).toBe('Please enter amount between 50 and 20.000.000 with maximum 2 decimal places');
    message = component.getErrorMessage('note');
    expect(message).toBe('Please enter minimum 1 and a maximum of 100 characters');
  })

  it('getMinDate() should work', () => {
    component.getMinDate();
  })

  it('sort() should work', () => {
    let data = [
      {id: "1",accountName: "abc",iban: "abc",date: '20-05-2022',amount: "100",note: "abc"},
      {id: "2",accountName: "def",iban: "def",date: '21-05-2022',amount: "200",note: "def"}
    ]
    component.tableData = data.slice();
    component.sortValue = '';
    component.sort();
    expect(component.tableData[0]).toBe(data[0]);
    component.sortValue = 'DateAscending';
    component.sort();
    expect(component.tableData[0]).toBe(data[0]);
    component.sortValue = 'AmountAscending';
    component.sort();
    expect(component.tableData[0]).toBe(data[0]);
    component.sortValue = 'DateDescending';
    component.sort();
    expect(component.tableData[0]).toBe(data[1]);
    component.sortValue = 'AmountDescending';
    component.sort();
    expect(component.tableData[0]).toBe(data[1]);
  })
});
