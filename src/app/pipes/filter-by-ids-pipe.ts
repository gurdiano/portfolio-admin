import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByIds'
})
export class FilterByIdsPipe implements PipeTransform {

  transform<T extends { tech: { id: number } }>(items: T[] | null | undefined, ids: number[]): T[] {
    if (!items || !ids?.length) return [];
    return ids
      .map(id => items.find(item => item.tech.id === id))
      .filter((item): item is T => !!item);
  }

}
