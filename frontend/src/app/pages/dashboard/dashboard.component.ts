import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { LotteryService } from '../../services/lottery.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../../models/ticket.model';

import { faRotateRight, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Mode } from '../../enum/mode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {

  #lotteryService = inject(LotteryService)
  #modalService = inject(NgbModal)
  #router = inject(Router)
  #route = inject(ActivatedRoute)
  #loginService = inject(LoginService)


  private routeSub: Subscription | undefined;
  faRotateRight = faRotateRight;
  faFloppyDisk = faFloppyDisk;
  numberFrequencies: { [key: number]: number } = {};
  numberFields: number = 4;
  showSuperzahl: boolean = true;
  headline: string = 'Add ticket';
  mode: string = Mode.ADD;
  ticketList: Ticket[] = [];
  error : Boolean = false;
  errorMessage : string = '';
  processing : Boolean = false;

  @ViewChild('frequenciesModal') frequenciesModal: TemplateRef<any> | undefined;
  @ViewChild('settingsModal') settingsModal: TemplateRef<any> | undefined;

  ticket: Ticket = {
    fields: [],
    hasSuperzahl: false,
    superzahl: 0,
    id: 0
  };

  constructor() {
    this.generateNumbers()
  }

  ngOnInit() {
    this.routeSub = this.#route.params.subscribe(async params => {
      const category = params['cat'];
      if (category) {
        if (category == 'list') {
          this.mode = Mode.LIST;
          this.headline = 'My tickets'
          this.loadTickets()
        }
      }
      else {
        this.generateSuperzahl()
      }
    });
  }

  get listMode(): Boolean {
    return this.mode === Mode.LIST;
  }

  get showFields(): Boolean {
    return ( this.mode === Mode.ADD ||
      this.mode === Mode.LIST && this.ticketList.length > 0 );
  }

  get emptyTicketList(): Boolean {
    return this.mode === Mode.LIST && this.ticketList.length === 0;
  }

  // ---------------------------------------------------

  getNumberFrequenciesKeys(): number[] {
    return Object.keys(this.numberFrequencies).map(Number);
  }

  generateSuperzahl(): void {
    this.ticket.superzahl = this.#lotteryService.generateRandomNumber(9, this.ticket.superzahl);
  }

  generateNumbers(): void {
    this.ticket.fields = this.#lotteryService.generateLottoFields(this.numberFields);
    this.numberFrequencies = this.#lotteryService.countNumberFrequencies(this.ticket.fields);
  }

  openNumberFrequenciesModal() {
    this.#modalService.open(this.frequenciesModal, { size: 'lg' });
  }

  openSettingsModal() {
    this.#modalService.open(this.settingsModal, { size: 'lg' });
  }

  submitFormSettings() {
    this.numberFields = (this.numberFields < 1) ? 1 : this.numberFields
    if (this.showSuperzahl) {
      this.generateSuperzahl()
    }
    this.generateNumbers()
    this.#modalService.dismissAll()
  }

  logout() {
    this.#loginService.logout();
    this.#router.navigate(['/login']);
  }

  loadTickets() {
    this.processing = true
    this.error = false
    this.#lotteryService.loadTickets().subscribe({
      next: (response) => {
        this.processing = false
        this.ticketList = response as Ticket[];
        this.ticketList.sort((a, b) => b.id - a.id);

        if (this.ticketList.length > 0) {
          this.showTicket(this.ticketList[0].id)
        }
      },
      error: (error) => {
        this.processing = false
        this.errorMessage = 'Error loading tickets'
      }
    });
  }

  createTicket() {
    this.ticket.hasSuperzahl = this.showSuperzahl;

    this.#lotteryService.createTicket((this.ticket)).subscribe({
      next: (response) => {
        console.log('Ticket saved', response);
        this.#router.navigate(['/list']);
      },
      error: (error) => {
        this.errorMessage = 'Error saving ticket'
      }
    });
  }

  onSelectionChange(event: any) {
    const selectedValue = event.target.value;
    this.showTicket(parseInt(selectedValue))
  }

  showTicket(id: number) {
    if (this.ticketList && this.ticketList.length > 0) {
      const ticket = this.ticketList.find(ticket => ticket.id === id);
      if (ticket) {
        this.ticket = ticket
        this.showSuperzahl = ticket.hasSuperzahl
      }
    }
  }

}
