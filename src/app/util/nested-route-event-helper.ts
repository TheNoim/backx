import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

// Creates an Observable which fires everytime the route changes to the current route
export const nestedRouteEventHelper = (
    activatedRoute: ActivatedRoute,
    router: Router
) =>
    router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => activatedRoute),
        map((route) => {
            while (route.firstChild) {
                route = route.firstChild;
            }
            return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
    );
