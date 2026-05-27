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

// src/app/pages/grafana-cloud-page.component.ts
var GrafanaCloudPageComponent = class _GrafanaCloudPageComponent {
  static \u0275fac = function GrafanaCloudPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GrafanaCloudPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GrafanaCloudPageComponent, selectors: [["app-grafana-cloud-page"]], decls: 1, vars: 0, consts: [["fuente", "cloud"]], template: function GrafanaCloudPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-dashboard", 0);
    }
  }, dependencies: [DashboardComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GrafanaCloudPageComponent, [{
    type: Component,
    args: [{
      selector: "app-grafana-cloud-page",
      standalone: true,
      imports: [DashboardComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<app-dashboard fuente="cloud"></app-dashboard>`
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GrafanaCloudPageComponent, { className: "GrafanaCloudPageComponent", filePath: "src/app/pages/grafana-cloud-page.component.ts", lineNumber: 11 });
})();
export {
  GrafanaCloudPageComponent
};
//# sourceMappingURL=chunk-3Y4RIYW7.js.map
