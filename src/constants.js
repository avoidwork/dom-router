export const cssCurrent = "dr-current";
export const cssHidden = "dr-hidden";
export const delimiter = "/";
export const empty = "";
export const hash = "#";
export const notHash = /.*\#/;
export const selectorHasHash = "a[href=*'#']";
export const render = window.requestAnimationFrame || function (fn) { setTimeout(fn(new Date().getTime() - time), 16); };
