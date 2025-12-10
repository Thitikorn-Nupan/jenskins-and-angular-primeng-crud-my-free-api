import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataTreeTable} from "../../intermediary-entities/data-tree-table";
import {HeaderColumn} from "../../intermediary-entities/header-column";
import {Actor} from "../../entities/actor";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicIconField} from "../../intermediary-entities/dynamic-icon-field";
import {DynamicDialogConfirm} from "../../intermediary-entities/dynamic-dialog-confirm";
import {Movie} from "../../entities/movie";
import {UsefulHelper} from "../../helpers/useful-helper";
import {ActorOneToManyService} from "../../services/actor-one-to-many.service";
import {ReqOrderBy} from "../../entities/req-order-by";

@Component({
  selector: 'app-to-do-one-to-many',
  templateUrl: './to-do-one-to-many.component.html',
  styleUrl: './to-do-one-to-many.component.css'
})
export class ToDoOneToManyComponent implements OnInit, AfterViewInit ,  AfterViewChecked {
  protected actors!: Actor[]
  protected actorIncludeMovies!: Actor
  protected actorsId!: string []
  protected moviesId!: string []
  private actorEvent!: Actor

  // Table
  public headerColumns!: HeaderColumn[]
  public data!: DataTreeTable<any>[]
  public id: string = 'actor-tree-table'
  public tableTitle: string = 'Actor Table'
  public loading!: boolean
  public scrollable: boolean = true
  public paginator: boolean = true
  public rowsScope: number = 5

  // Sub Table
  public visibleSubTable: boolean = false;
  public headerColumnsSubTable!: HeaderColumn[]
  public dataSubTable!: DataTreeTable<any>[]
  public idSubTable: string = 'movie-tree-table'
  public tableTitleSubTable: string = 'Movie Table'
  public loadingSubTable!: boolean
  public scrollableSubTable: boolean = true
  public paginatorSubTable: boolean = true
  public rowsScopeSubTable: number = 5


  // Form Open Search
  public formGroupOpenSearch!: FormGroup;
  public formTitleOpenSearch: string = 'Open Standard Search';
  public dynamicIconFieldsOpenSearch!: DynamicIconField[];
  public enableFormGroupSearch: boolean = false;

  // Form Actor Search
  public formGroupSearch!: FormGroup;
  public formTitleSearch: string = 'Actor Form Search';
  public dynamicIconFieldsSearch!: DynamicIconField[];


  // Dialog Warning
  public visibleConfirm: boolean = false;
  public draggableConfirm: boolean = false;
  public resizableConfirm: boolean = false;
  public dynamicDialogConfirm!: DynamicDialogConfirm
  private modeDialog!: 'DELETE' | 'SUBMIT' | 'WARN' | 'CONFIRM' | 'WARN_NO_RELATION' | null

  constructor(private readonly actorOneToManyService: ActorOneToManyService,private readonly cdRef: ChangeDetectorRef) {}

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges()
  }

  async ngAfterViewInit(): Promise<void> {
    await this.reloadActors().then(() : void => (this.reloadActorsId())).then(() : void => (this.reloadMoviesId()))
  }

  ngOnInit(): void {
    this.setDialogConfirm()
    this.setupFormGroupSearch()
    this.setupFormGroupOpenSearch()
  }


  // Setup forms
  private setDialogConfirm(): void {
    this.visibleConfirm = false;
    this.draggableConfirm = false;
    this.resizableConfirm = false;
    this.dynamicDialogConfirm = new DynamicDialogConfirm()
  }

  private setupFormGroupSearch(): void {
    this.formGroupSearch = new FormGroup({})
    this.dynamicIconFieldsSearch = [
      new DynamicIconField('WHERE AID', 'aid', new FormControl(null, [Validators.maxLength(4)]), 'aid', false).setInputText(true).setPKeyFilter(null).setPlaceholder('A001'),
      new DynamicIconField(null, 'aidDesc', new FormControl(null), 'aidDesc', null).setRadio({
        status: true,
        options: [
          {name: 'AID DESC', key: 'desc'},
          {name: 'AID ASC', key: 'asc'},
        ]
      }),
      new DynamicIconField('WHERE FULLNAME', 'fullName', new FormControl(null), 'fullName', false).setInputText(true).setPKeyFilter(null).setPlaceholder('Mr. Alex Ryder'),
      new DynamicIconField(null, 'fullNameDesc', new FormControl(null), 'fullNameDesc', null).setRadio({
        status: true,
        options: [
          {name: 'FULLNAME DESC', key: 'desc'},
          {name: 'FULLNAME ASC', key: 'asc'},
        ]
      }),
      new DynamicIconField('WHERE BORN', 'born', new FormControl(null), 'born', false).setInputDate(true).setPKeyFilter(null),
      new DynamicIconField(null, 'bornDesc', new FormControl(null), 'bornDesc', null).setRadio({
        status: true,
        options: [
          {name: 'BORN DESC', key: 'desc'},
          {name: 'BORN ASC', key: 'asc'},
        ]
      }),
      new DynamicIconField('WHERE CONTACT', 'contact', new FormControl(null, [Validators.maxLength(10)]), 'contact', false).setInputText(true).setPKeyFilter('num').setPlaceholder('0898388283'),
      new DynamicIconField(null, 'contactDesc', new FormControl(null), 'contactDesc', null).setRadio({
        status: true,
        options: [
          {name: 'CONTACT DESC', key: 'desc'},
          {name: 'CONTACT ASC', key: 'asc'},
        ]
      }),
      new DynamicIconField('LENGTH', 'length', new FormControl(null, [Validators.maxLength(4)]), 'length', false).setInputText(true).setPKeyFilter('int').setPlaceholder('100'),
    ]
  }

  private setupFormGroupOpenSearch(): void {
    this.formGroupOpenSearch = new FormGroup({})
    this.dynamicIconFieldsOpenSearch = [
      new DynamicIconField(null, 'enableSearchForm', new FormControl(null), 'enableSearchForm', null).setCheckbox({
        status: true,
        options: [
          {name: 'ENABLE STANDARD SEARCH', key: 'enableForm'}
        ]
      })
    ]
  }

  private async setupTable(): Promise<void> {
    let actorsFormat: { data: Actor, subData: Actor [] | null } [] = []
    this.actors.forEach((actor: Actor) => (actorsFormat.push({data: actor, subData: null})))
    this.data = UsefulHelper.convertModelToDataTreeTable(actorsFormat)
    this.headerColumns = UsefulHelper.convertObjectToHeaderColumns(this.data[0] ? this.data[0].data : {
      aid: null,
      fullname: null,
      born: null,
      contact: null,
      movies: undefined
    }, ["movies"])
    this.loading = false
  }

  private setupTableSubTable(): void {
    setTimeout((): void => {
      this.loadingSubTable = false
      let moviesFormat: { data: Movie, subData: Movie [] | null }[] = []
      this.actorIncludeMovies.movies?.forEach((movie: Movie) => (moviesFormat.push({data: movie, subData: null})))
      this.dataSubTable = UsefulHelper.convertModelToDataTreeTable(moviesFormat)
      this.actorIncludeMovies.movies![0] !== undefined // if true
        ? this.headerColumnsSubTable = UsefulHelper.convertObjectToHeaderColumns(this.actorIncludeMovies.movies![0], ["actors", "action"]) // do
        : UsefulHelper.convertObjectToHeaderColumns({
          mid: null,
          title: null,
          categories: null,
          rate: null,
          year: null
        }, ["action"]) // else
    }, 500)
  }


  // Initial
  protected setInitialFormGroupSearch($event: FormGroup): void {
    this.formGroupSearch = $event
    const lengthControl: any = this.formGroupSearch.get('length')
    lengthControl?.disable({emitEvent: false})
    this.formGroupSearch.valueChanges.subscribe((item: any): void => {
      if ((item.aid && item.aid !== '') || (item.aidDesc) || (item.fullName && item.fullName !== '') || (item.fullNameDesc) || (item.born && item.born !== '') || (item.bornDesc) || (item.contact && item.contact !== '') || (item.contactDesc)) {
        lengthControl?.enable({emitEvent: false})
      } else {
        lengthControl?.disable({emitEvent: false})
      }
    })
  }

  protected setInitialFormGroupOpenSearch($event: FormGroup): void {
    this.formGroupOpenSearch = $event
    this.formGroupOpenSearch.valueChanges.subscribe((item: any) : void => {
      if (item.enableSearchForm) {
        if (item.enableSearchForm.length > 0) {
          this.enableFormGroupSearch = true
        } else {
          this.enableFormGroupSearch = false
        }
      }
    })
  }

  protected setInitialData($event: DataTreeTable<any>[]): void {
    this.data = $event;
  }

  protected setInitialDataSubTable($event: DataTreeTable<any>[]): void {
    this.dataSubTable = $event;
  }


  // Events
  protected setOptionalEventTreeTable($event: Actor): void {
    this.actorEvent = $event
    this.tableTitleSubTable = 'Movie Table Of Actor ' + this.actorEvent.aid
    this.reloadActorIncludeMovies(this.actorEvent.aid).then(() : void => (this.setupTableSubTable()))
  }

  protected async setOkEventDialogConfirm(): Promise<void> {
    this.visibleConfirm = false
    this.modeDialog = null
  }

  protected setCloseEventDialogConfirm(): void {
    this.visibleConfirm = false
    this.modeDialog = null
  }


  protected async setSubmitEventFormGroupSearch(): Promise<void> {
    const values: any = this.formGroupSearch.value
    const actor: Actor = {
      aid: values['aid']!,
      fullname: values['fullName']!,
      born: values['born']!,
      contact: values['contact']!,
      movies: undefined
    }
    let reqOrderBy: ReqOrderBy = {
      length: values['length'] ? Number(values['length']) : 100,
      orderBy: [],
      whereModel: actor
    }
    if (values['aidDesc']) {
      reqOrderBy.orderBy.push({column: 'aid', direction: values['aidDesc']['key']})
    }
    if (values['fullNameDesc']) {
      reqOrderBy.orderBy.push({column: 'fullname', direction: values['fullNameDesc']['key']})
    }
    if (values['bornDesc']) {
      reqOrderBy.orderBy.push({column: 'born', direction: values['bornDesc']['key']})
    }
    if (values['contactDesc']) {
      reqOrderBy.orderBy.push({column: 'contact', direction: values['contactDesc']['key']})
    }
    this.actorOneToManyService.getSelectAllHaveOrderBy(reqOrderBy).subscribe(async (res: Actor[]): Promise<void> => {
      if (res) {
        this.actors = res
        await this.setupTable()
      }
    })
  }

  protected setClearEventFormGroupSearch(): void {
    this.formGroupSearch.reset()
  }


  // Reqs APIs
  private async reloadActors(): Promise<void> {
    this.loading = true
    this.actorOneToManyService.getSelectAll().subscribe(async (data: Actor[]): Promise<void> => {
      this.actors = data
      await this.setupTable()
    })
  }

  private async reloadActorIncludeMovies(aid: string): Promise<void> {
    this.loadingSubTable = true
    this.visibleSubTable = true
    this.actorOneToManyService.getSelectOneIncludeRelationByPk(aid).subscribe((data: Actor) => (this.actorIncludeMovies = data))
  }

  private reloadActorsId(): void {
    this.actorOneToManyService.getSelectAllAids().subscribe((data: string[]): void => {
      this.actorsId = this.sortStringsByNumericPostfix(data)
    })
  }

  private reloadMoviesId(): void {
    this.moviesId = []
    this.actorOneToManyService.getMovieSelectAll().subscribe((data: Movie[]) => {
      data.forEach((movie: Movie): void => {
        this.moviesId.push(movie.mid)
      })
    })
  }


  // Helpers
  private sortStringsByNumericPostfix(arr: string[]): string[] {
    return arr.sort((a, b) => {
      // Regular expression to extract the number at the end of the string
      const regex = /(\d+)$/;

      const matchA = a.match(regex);
      const matchB = b.match(regex);

      // If both strings have a numeric postfix, compare them numerically
      if (matchA && matchB) {
        const numA = parseInt(matchA[1], 10);
        const numB = parseInt(matchB[1], 10);
        return numA - numB;
      }

      // If only one has a numeric postfix, or neither do,
      // fallback to default string comparison or a custom rule.
      // For this example, if only 'a' has a number, it comes after 'b'.
      // If only 'b' has a number, it comes after 'a'.
      // If neither have a number, use localeCompare for alphabetical sort.
      if (matchA && !matchB) {
        return 1; // 'a' comes after 'b'
      }
      if (!matchA && matchB) {
        return -1; // 'a' comes before 'b'
      }
      return a.localeCompare(b); // Default string comparison
    });
  }

}
