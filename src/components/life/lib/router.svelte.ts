
export interface Location {
  pathname: string;
  search: string;
  hash: string;
}

function readLocation(): Location {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
}

let current = $state<Location>(readLocation());

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    current = readLocation();
  });
}

export function getLocation() {
  return {
    get state() {
      return current;
    },
  };
}

export function normalizePath(path: string): string {
  let p = path.trim();
  if (!p || p === "/" || p === "/life" || p === "/life/") return "/life/";

  if (p.startsWith("/life/")) {
    return p.endsWith("/") ? p : `${p}/`;
  }
  if (p.startsWith("/life")) {
    const sub = p.slice(5);
    return `/life${sub.endsWith("/") ? sub : `${sub}/`}`;
  }

  const clean = p.startsWith("/") ? p.slice(1) : p;
  return `/life/${clean.endsWith("/") ? clean : `${clean}/`}`;
}

export function navigate(to: string) {
  const target = normalizePath(to);
  history.pushState(null, "", target);
  current = readLocation();
  window.scrollTo(0, 0);
}