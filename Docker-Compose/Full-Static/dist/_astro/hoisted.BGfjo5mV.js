document.addEventListener("astro:before-swap",e=>[...e.newDocument.head.querySelectorAll('link[as="font"]')].forEach(o=>o.remove()));
