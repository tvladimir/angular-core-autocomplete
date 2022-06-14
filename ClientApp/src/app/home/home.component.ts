import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataService } from '../services/data/data.service';
import { LoaderService } from '../services/loader/loader.service';
interface City{
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  cities: City[] = [];
  cities$!: Observable<City[]>;

  citiesNames: string[] = [];

  isLoading: Subject<boolean>;

  selectedItem: any;

  constructor(private dataService: DataService, private loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading;
  }

  selectEvent(item: any) {
    this.selectedItem = item;
  }

  ngOnInit(): void {
    this.dataService.getCities<City>().subscribe(cities => {
      this.cities = cities;
      this.citiesNames = cities.map(city => city.name);
    })
  }
}
