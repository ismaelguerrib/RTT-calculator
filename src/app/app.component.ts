import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  RTT: number = 0;
  maxOfWorkedDays: number = 218;

  paidLeaveDays: number = 25;
  year: number = 2021;

  ngOnInit() {}

  getNumberOfRTT(param: {
    year: number;
    paidLeaveDays: number;
    maxOfWorkedDays: number;
  }): number {
    const { paidLeaveDays, year, maxOfWorkedDays } = param;

    const nonWorkingDays = this.getNonWorkingDaysInYear(year);
    const daysInTheYear = this.getNumberOfDaysInTheYear(year);
    const workableDays = daysInTheYear - nonWorkingDays;
    const workedDays = workableDays - paidLeaveDays;
    const RTT = workedDays - maxOfWorkedDays;

    return RTT;
  }

  private getNumberOfDaysInTheYear(year: number): number {
    return year % 4 === 0 ? 366 : 365;
  }

  private getPublicHolidaysInYear(year: number): Date[] {
    const fixedPublicHolidays: Date[] = [
      new Date(year, 0, 1), // New Year's Day (Jour de l'an)
      new Date(year, 4, 1), // Labour Day (Fête du Travail)
      new Date(year, 4, 8), // WWII Victory Day (Fête de la Victoire 1945)
      new Date(year, 6, 14), // Bastille Day (Fête Nationale)
      new Date(year, 7, 15), // Assumption of Mary (Assomption)
      new Date(year, 10, 1), // All Saints' Day (La Toussaint)
      new Date(year, 10, 11), // Armistice Day (Jour d'armistice)
      new Date(year, 11, 25), // Christmas Day (Noël)
    ];
    const easterBasedPublicHolidays = this.getEasterBasedPublicHolidays(year);
    const publicHolidays = fixedPublicHolidays.concat(
      easterBasedPublicHolidays
    );
    return publicHolidays;
  }

  private getWeekendDaysInYear(year: number): number {
    const numberOfDays: number = this.getNumberOfDaysInTheYear(year);
    let weekendDays: number = 0;

    for (let day = 1; day <= numberOfDays; day++) {
      const currentDate = new Date(year, 0, day);
      if (currentDate.getDay() === 6 || currentDate.getDay() === 0) {
        weekendDays++;
      }
    }
    return weekendDays;
  }

  private getNonWorkingDaysInYear(year: number): number {
    const weekDaysPublicHolidays = this.getPublicHolidaysInYear(year).filter(
      (date) => date.getDay() !== 6 && date.getDay() !== 0
    );

    const weekendDays = this.getWeekendDaysInYear(year);

    return weekDaysPublicHolidays.length + weekendDays;
  }

  private getEasterBasedPublicHolidays(year: number): Date[] {
    const easterDate = this.calculateEasterDate(year);

    // Easter Monday is the day after Easter Sunday
    const easterMonday = new Date(easterDate);
    easterMonday.setDate(easterMonday.getDate() + 1);

    // Ascension Thursday is 39 days after Easter Sunday
    const ascensionThursday = new Date(easterDate);
    ascensionThursday.setDate(ascensionThursday.getDate() + 39);

    // Whit Monday is 50 days after Easter Sunday
    const goodFriday = new Date(easterDate);
    goodFriday.setDate(goodFriday.getDate() - 2);

    return [easterMonday, goodFriday, ascensionThursday];
  }

  private calculateEasterDate(year: number): Date {
    const goldenNumber = (year % 19) + 1;
    const century = Math.floor(year / 100) + 1;
    const epact =
      (11 * goldenNumber +
        20 +
        century -
        Math.floor(century / 4) -
        Math.floor((8 * century + 5) / 25)) %
      30;
    let daysToNextFullMoon = 44 - epact;
    if (daysToNextFullMoon < 21 || (daysToNextFullMoon === 21 && epact >= 11)) {
      daysToNextFullMoon++;
    }
    const fullMoonDate =
      new Date(year, 2, 21).getTime() +
      daysToNextFullMoon * 24 * 60 * 60 * 1000;
    const easterDate = new Date(fullMoonDate);
    easterDate.setDate(easterDate.getDate() + 7 - easterDate.getDay()); // Find next Sunday
    return easterDate;
  }
}
