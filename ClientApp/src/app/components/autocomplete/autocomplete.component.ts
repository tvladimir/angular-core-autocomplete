import {
  Component, ElementRef,
  EventEmitter, Input, OnInit,
  Output,
  TemplateRef,
  ViewChild} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';
import helperFunction from './autocomplete.helper';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  host: {
    '(document:click)': 'handleClick($event)',
  },
})

export class AutocompleteComponent implements OnInit{
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('filteredListElement') filteredListElement!: ElementRef;

  @Input() public data: any[] = [];
  @Input() public searchKeyword!: string;
  @Input() public placeholder = '';
  @Input() public isLoadingText = 'Loading...';
  @Input() public notFoundText = 'Not found';
  @Input() public isLoading: boolean | unknown = false;
  @Input() public debounceTime: number = 300;
  @Input() public disabled: boolean = false;
  @Output() selected = new EventEmitter<any>();

  public filteredList: any[] = [];
  public notFound = false;
  public isOpen = false;

  public query = '';
  private selectedItem!: any;
  public elementRef;
  inputKeyUp$!: Observable<any>;
  inputKeyDown$!: Observable<any>;


  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngOnInit(): void {
  }

  // /**
  //  * ngAfterViewInit - Init SearchInput Event stream
  //  */
  ngAfterViewInit() {
    this.initSearchInputEventStream();
  }

  // /**
  //  * Check is item string
  //  */
  isString(item: any): boolean{
    return typeof item === 'string';
  }

  // /**
  //  * Use Filter data function
  //  */
  public filterList() {
    this.filteredList = this.filterListFunction();
    this.notFound = !this.filteredList.length ? true : false;
  }

  // /**
  //  * Filter data function
  //  */
  public filterListFunction(): any[] {
    if (!this.query) return [...this.data];
    return this.data.filter((item: any) => {
      if (typeof item === 'string') {
        // string logic, check equality of strings
        return item.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      } else if (typeof item === 'object' && item instanceof Object) {
        // object logic, check property equality
        return item[this.searchKeyword] ? item[this.searchKeyword].toLowerCase().indexOf(this.query.toLowerCase()) > -1 : "";
      }
      return false;
    });
  }

  // /**
  //  * Select item from list
  //  */
  public selectItem(item: any) {
    console.log(item);
    if (!item && !this.query){
      this.query = '';
    }else{
      this.query = !this.isString(item) ? item[this.searchKeyword] : item;
    }
    this.selectedItem = item;
    this.selected.emit(item);
    this.searchInput.nativeElement.focus();
    this.handleClose();
  }

  // /**
  //  * Event Click for document
  //  */
  public handleClick(event: any) {
    let inside = false;
    for (let node = event.target; node; node = node.parentNode) {
        if (node === this.elementRef.nativeElement) {
            inside = true;
            if (this.filteredList.length) {
              this.handleOpen();
            }
            break;
        }
    }
    if (!inside) {
      this.handleClose();
    }
  }

  // /**
  //  * Open autocomplete list
  //  */
  handleOpen() {
    this.isOpen = true;
  }

  // /**
  //  * Close autocomplete list
  //  */
  handleClose() {
    if (!this.isOpen) {
      return;
    }
    this.query = !this.isString(this.selectedItem) && this.selectedItem !== undefined ? this.selectedItem[this.searchKeyword] : this.selectedItem || '';
    this.isOpen = false;
    this.filteredList = [];
    this.notFound = false;
  }

  // /**
  //  * Option KeyDown event (from template)
  //  * * @param event - keyboard event
  //  * * @param item
  //  */
  onOptionKeyDown(event: any, item: any){
    event.preventDefault();
    if (helperFunction.isArrowUpDown(event.keyCode)){
      this.changeFocusItem(event);
      return;
    }
    if (helperFunction.isEnter(event.keyCode)){
      this.selectItem(item);
      return;
    }
    if (helperFunction.isESC(event.keyCode)){
      this.handleClose();
      return;
    }
    if (helperFunction.isTab(event.keyCode)){
      this.changeFocusItem(event);
      return;
    }
  }

  // /**
  //  * Init SearchInput Event stream
  //  */
  initSearchInputEventStream() {
    this.inputKeyUp$ = fromEvent( this.searchInput.nativeElement, 'keyup' ).pipe(
      map( (e: any) => e)
    );
    this.inputKeyDown$ = fromEvent( this.searchInput.nativeElement, 'keydown' ).pipe(
      map( (e: any) => e )
    );
    this.listenSearchInputEventStream();
  }

  // /**
  //  * Listen Streams Event SearchInput
  //  * * @param event - keyboard event
  //  */
  listenSearchInputEventStream() {

    // Exclude (ArrowUpDown,Enter,ESC,Tab)
    this.inputKeyUp$.pipe(
        filter(e =>
          !helperFunction.isArrowUpDown(e.keyCode) &&
          !helperFunction.isEnter(e.keyCode) &&
          !helperFunction.isESC(e.keyCode) &&
          !helperFunction.isTab(e.keyCode)),
        debounceTime(this.debounceTime)
      ).subscribe(e => {
      this.onKeyUpSearchInput();
    });

    // Arrows keyDown
    this.inputKeyDown$.pipe(filter(
      e => helperFunction.isArrowUpDown(e.keyCode)
    )).subscribe(e => {
      e.preventDefault();
      this.changeFocusItem(e);
    });

    // ESC keyUp
    this.inputKeyUp$.pipe(
      filter(e => helperFunction.isESC(e.keyCode),
        debounceTime(100))
    ).subscribe(e => {
      this.handleClose();
    });

    // enter keyDown
    this.inputKeyDown$.pipe(filter(e => helperFunction.isEnter(e.keyCode))).subscribe(e => {
      this.selectItem(this.selectedItem);
    });
  }

  // /**
  //  * KeyUp event for SearchInput
  //  */
  onKeyUpSearchInput() {
    this.filterList();
    this.isOpen = true;
  }

  // /**
  //  * Change focused item (arrows + tab + shift/tab)
  //  * * @param event - keyboard event
  //  */
  changeFocusItem(event: any) {
    console.log(typeof event);
    this.scrollToFocusedItem(event.key, event.shiftKey);
  }

  // /**
  //  * Scroll (focus) to next/prev element
  //  * * @param key
  //  * * @param shiftKey - shift key pressed
  //  */
  scrollToFocusedItem(key: String, shiftKey?: boolean) {

    let optionList = this.filteredListElement?.nativeElement.childNodes[0].childNodes[0].childNodes;
    if (!optionList) {
      return;
    }

    // Define list element
    const items = Array.prototype.slice.call(optionList).filter((node: any) => {
      if (node.nodeType === 1) {
        // if node is element
        return node.className.includes('item');
      } else {
        return false;
      }
    });

    if (!items.length) {
      return;
    }

    let index = items.findIndex((element) => element === document.activeElement);

    if (key === 'ArrowDown' || (key === 'Tab' && !shiftKey)) {
      if (index < this.filteredList.length - 1){
        items[index + 1].focus();
      }
    } else if (key === 'ArrowUp' || (key === 'Tab' && shiftKey)) {
      if (index > 0) {
        items[index - 1].focus();
      }else{
        this.searchInput.nativeElement.focus();
      }
    }
  }

}
