import { ScrollingModule } from '@angular/cdk/scrolling';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutocompleteComponent } from './autocomplete.component';

const objectList = new Array(1000).fill('Demo value').map((e,i) => {
  return {
    label: `${e} ${i}`,
    index: i,
    value: Math.floor(Math.random() * (i + 5)),
  }
});
const stringList = new Array(1000).fill('Demo value').map((e,i) => `${e} ${i}`);

describe('AutocompleteComponent', () => {

  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,
        ReactiveFormsModule,
        ScrollingModule
      ],
      declarations: [
        AutocompleteComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should created with (object array)', () => {
    component.data = objectList;
    component.searchKeyword = 'label';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.autocomplete-container')).toBeTruthy();
  });

  it('should open autocomplete on text changes (object array)', fakeAsync((): void =>  {
    component.data = objectList;
    component.searchKeyword = 'label';
    component.debounceTime = 20;// Set debounce (default 300)
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input'); // Returns DebugElement
    inputElement.dispatchEvent(new Event('focusin'));
    inputElement.value = 'val';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('keyup'));
    tick(450); // Wait for debounce for rendering
    fixture.detectChanges();
    const optionsContainer = fixture.nativeElement.querySelector('.options-container');
    expect(optionsContainer).toBeTruthy();
  }));

  it('should open "Not found" on text changes (object array)', fakeAsync((): void =>  {
    component.data = objectList;
    component.searchKeyword = 'label';
    component.debounceTime = 20;// Set debounce (default 300)
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input'); // Returns DebugElement
    inputElement.dispatchEvent(new Event('focusin'));
    inputElement.value = 'Yay';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('keyup'));
    tick(450); // Wait for debounce for rendering
    fixture.detectChanges();
    const notFoundElement = fixture.nativeElement.querySelector('.not-found');
    expect(notFoundElement).toBeTruthy();
  }));

  it('should open "Loading" (object array)', fakeAsync((): void =>  {
    component.data = objectList;
    component.searchKeyword = 'label';
    component.debounceTime = 20;// Set debounce (default 300)
    component.isLoading = true;
    fixture.detectChanges();
    const loadingElement = fixture.nativeElement.querySelector('.loading');
    expect(loadingElement).toBeTruthy();
  }));

  it('should created with string array', () => {
    component.data = stringList;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.autocomplete-container')).toBeTruthy();
  });

  it('should open autocomplete on text changes (string array)', fakeAsync((): void =>  {
    component.data = stringList;
    component.debounceTime = 20;// Set debounce (default 300)
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input'); // Returns DebugElement
    inputElement.dispatchEvent(new Event('focusin'));
    inputElement.value = 'val';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('keyup'));
    tick(450); // Wait for debounce for rendering
    fixture.detectChanges();
    const optionsContainer = fixture.nativeElement.querySelector('.options-container');
    expect(optionsContainer).toBeTruthy();
  }));

  it('should open "Not found" on text changes (string array)', fakeAsync((): void =>  {
    component.data = stringList;
    component.debounceTime = 20;// Set debounce (default 300)
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input'); // Returns DebugElement
    inputElement.dispatchEvent(new Event('focusin'));
    inputElement.value = 'Yay';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('keyup'));
    tick(450); // Wait for debounce for rendering
    fixture.detectChanges();
    const notFoundElement = fixture.nativeElement.querySelector('.not-found');
    expect(notFoundElement).toBeTruthy();
  }));

  it('should open "Loading" (string array)', fakeAsync((): void =>  {
    component.data = stringList;
    component.debounceTime = 20;// Set debounce (default 300)
    component.isLoading = true;
    fixture.detectChanges();
    const loadingElement = fixture.nativeElement.querySelector('.loading');
    expect(loadingElement).toBeTruthy();
  }));
});
