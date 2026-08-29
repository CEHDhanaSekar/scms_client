import { computed, Injectable, inject } from '@angular/core';
import { MENU_CONFIG, MenuItem } from '../../library/constants/menu.constants';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly permissionService = inject(PermissionService);

  readonly menu = computed(() => this.filterMenu(MENU_CONFIG));

  private filterMenu(items: MenuItem[]): MenuItem[] {
    return items.reduce<MenuItem[]>((visibleItems, item) => {
      const visibleChildren = item.children ? this.filterMenu(item.children) : undefined;
      const isVisible = this.permissionService.hasPermission(item.permission);

      if (!isVisible || (item.children && !visibleChildren?.length)) {
        return visibleItems;
      }

      visibleItems.push({ ...item, ...(visibleChildren ? { children: visibleChildren } : {}) });
      return visibleItems;
    }, []);
  }
}
