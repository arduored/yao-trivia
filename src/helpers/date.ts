export type ItemWithDate = { date: Date } & Record<any, any>

/*
 * @param from ItemWithDate[]
 * @param to Date. Default Date.Now
 * */
export function findNearestDateFrom(from: ItemWithDate[], to=Date.Now()): Date {
    let nearestDate = from[0].date

    from.forEach( item => {
       nearestDate = item.date.getTime() > nearestDate.getTime() ? item.date: nearestDate;
    });

    return nearestDate
}
