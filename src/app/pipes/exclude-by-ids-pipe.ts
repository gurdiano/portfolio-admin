import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeByIds'
})
export class ExcludeByIdsPipe implements PipeTransform {

  transform<T extends { tech: { id: number } }>(items: T[] | null | undefined, idsToExclude: number[]): T[] {
    if (!items) return [];
    if (!idsToExclude?.length) return items;
    return items.filter(item => !idsToExclude.includes(item.tech.id));
  }

}
