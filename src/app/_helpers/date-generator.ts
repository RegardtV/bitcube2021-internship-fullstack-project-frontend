export class DateGenerator {

    getCurrentDate(): string {
        const dateObj: Date = new Date();
        let month: any = dateObj.getUTCMonth() + 1; //months from 1-12
        if (month < 10) { month = `0${month}`; }
        const day: number = dateObj.getUTCDate();
        const year: number = dateObj.getUTCFullYear();
        const newDate: string = day + "-" + month + "-"  + year;
        return newDate;
    }
}