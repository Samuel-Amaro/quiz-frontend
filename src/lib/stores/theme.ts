import { writable } from 'svelte/store';
import type { Theme } from '$lib/types/Theme';
import { browser } from '$app/environment';

let themeSaved: Theme | undefined =  undefined;

if(browser) {
  themeSaved = localStorage.getItem("theme") !== null ? (localStorage.getItem("theme") as Theme) : 'light';
}

export const theme = writable<Theme>(themeSaved);

theme.subscribe((value) => {
  if(browser) {
    localStorage.setItem("theme", value);
    document.body.setAttribute("data-theme", value);
  }
});
