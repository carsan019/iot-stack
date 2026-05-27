import {
  DashboardComponent
} from "./chunk-HLE4O5JU.js";
import {
  ChangeDetectionStrategy,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement
} from "./chunk-XPOWK7MC.js";

// src/app/pages/grafana-local-page.component.ts
var GrafanaLocalPageComponent = class _GrafanaLocalPageComponent {
  static \u0275fac = function GrafanaLocalPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GrafanaLocalPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GrafanaLocalPageComponent, selectors: [["app-grafana-local-page"]], decls: 1, vars: 0, consts: [["fuente", "local"]], template: function GrafanaLocalPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-dashboard", 0);
    }
  }, dependencies: [DashboardComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GrafanaLocalPageComponent, [{
    type: Component,
    args: [{
      selector: "app-grafana-local-page",
      standalone: true,
      imports: [DashboardComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<app-dashboard fuente="local"></app-dashboard>`
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GrafanaLocalPageComponent, { className: "GrafanaLocalPageComponent", filePath: "src/app/pages/grafana-local-page.component.ts", lineNumber: 11 });
})();
export {
  GrafanaLocalPageComponent
};
//# sourceMappingURL=chunk-24R27QYJ.js.map
