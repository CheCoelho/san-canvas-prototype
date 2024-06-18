import { Component, h } from '@stencil/core';
import { Router } from '../../globals/router';
import { Route, match } from 'stencil-router-v2';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  scoped: true,
})
export class AppRoot {
  render() {
    return (
      <div>
        <header>
          <h1>Stencil App Starter</h1>
        </header>

        <main>
          <Router.Switch>
            <Route path={match(`/`)}>
              <app-home></app-home>
            </Route>
          </Router.Switch>
        </main>
      </div>
    );
  }
}
