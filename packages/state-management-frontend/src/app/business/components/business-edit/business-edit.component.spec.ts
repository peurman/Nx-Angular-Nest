import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '@clapp1/clapp-angular';
import { MockModalService } from '../../models/mock-modal-service.interface';

import { BusinessEditComponent } from './business-edit.component';

describe('BusinessEditComponent', () => {
  let component: BusinessEditComponent;
  let fixture: ComponentFixture<BusinessEditComponent>;
  let mockModalService: MockModalService;

  beforeEach(async () => {
    mockModalService = {
      open: jest.fn(),
      close: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [BusinessEditComponent],
      providers: [
        {
          provide: ModalService,
          useValue: mockModalService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
