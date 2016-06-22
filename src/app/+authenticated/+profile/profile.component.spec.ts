import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ProfileComponent } from './profile.component';

describe('Component: Profile', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [ProfileComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([ProfileComponent],
      (component: ProfileComponent) => {
    expect(component).toBeTruthy();
  }));
});

@Component({
  selector: 'test',
  template: `
    <profile></profile>
  `,
  directives: [ProfileComponent]
})
class ProfileComponentTestController {
}

