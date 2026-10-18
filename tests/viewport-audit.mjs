import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const DIST_DIR = path.resolve('dist');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

// 1. Create a lightweight local static server
function startServer(port = 4321) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';

    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

// 2. CDP Helper
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.callbacks.has(data.id)) {
        const { resolve, reject } = this.callbacks.get(data.id);
        this.callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

const VIEWPORTS = [
  { name: 'Small mobile', width: 320, height: 568, isMobile: true },
  { name: 'Mobile', width: 360, height: 800, isMobile: true },
  { name: 'Mobile', width: 375, height: 812, isMobile: true },
  { name: 'Mobile', width: 390, height: 844, isMobile: true },
  { name: 'Large mobile', width: 430, height: 932, isMobile: true },
  { name: 'Tablet portrait', width: 768, height: 1024, isMobile: true },
  { name: 'Tablet / small laptop', width: 1024, height: 768, isMobile: false },
  { name: 'Laptop', width: 1280, height: 800, isMobile: false },
  { name: 'Desktop', width: 1440, height: 900, isMobile: false },
  { name: 'Large desktop', width: 1920, height: 1080, isMobile: false },
];

async function runAudit() {
  console.log('Starting local static server on port 4321...');
  const server = await startServer(4321);

  console.log('Launching headless Chrome for layout & responsive audit...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  // Wait for Chrome remote debugging endpoint
  let pageTarget = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      const targets = await res.json();
      pageTarget = targets.find((t) => t.type === 'page');
      if (pageTarget) break;
    } catch {}
  }

  if (!pageTarget) {
    console.error('Could not connect to Chrome DevTools Protocol');
    chromeProc.kill();
    server.close();
    process.exit(1);
  }

  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');

  const results = [];
  const testPages = ['/', '/projects/hatli/'];

  for (const pageUrl of testPages) {
    console.log(`\n========================================`);
    console.log(`Auditing Route: ${pageUrl}`);
    console.log(`========================================`);

    for (const vp of VIEWPORTS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile,
      });

      await cdp.send('Page.navigate', { url: `http://127.0.0.1:4321${pageUrl}` });
      await new Promise((r) => setTimeout(r, 400)); // wait for layout & fonts

      // Measure layout metrics in browser context
      const evalResult = await cdp.send('Runtime.evaluate', {
        expression: `
          (function() {
            const winWidth = window.innerWidth;
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const hasHorizontalScroll = docWidth > winWidth || bodyWidth > winWidth;

            // Find any overflowing elements
            const allElements = document.querySelectorAll('*');
            const overflowing = [];
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > winWidth + 1) {
                overflowing.push({
                  tag: el.tagName.toLowerCase(),
                  id: el.id,
                  className: el.className,
                  right: Math.round(rect.right),
                  expectedMax: winWidth
                });
              }
            }

            // Header state
            const header = document.querySelector('.site-header');
            const toggle = document.getElementById('mobile-menu-toggle');
            const desktopNav = document.querySelector('.desktop-nav');
            const brand = document.querySelector('.brand');

            const headerHeight = header ? header.offsetHeight : 0;
            const toggleVisible = toggle ? window.getComputedStyle(toggle).display !== 'none' : false;
            const desktopNavVisible = desktopNav ? window.getComputedStyle(desktopNav).display !== 'none' : false;

            return {
              winWidth,
              docWidth,
              bodyWidth,
              hasHorizontalScroll,
              overflowingCount: overflowing.length,
              sampleOverflow: overflowing.slice(0, 3),
              headerHeight,
              toggleVisible,
              desktopNavVisible
            };
          })()
        `,
        returnByValue: true,
      });

      const data = evalResult.result.value;
      const status = !data.hasHorizontalScroll ? 'PASS' : 'FAIL';

      results.push({
        route: pageUrl,
        viewport: `${vp.name} (${vp.width}×${vp.height})`,
        width: vp.width,
        height: vp.height,
        hasHorizontalScroll: data.hasHorizontalScroll,
        docWidth: data.docWidth,
        winWidth: data.winWidth,
        headerHeight: data.headerHeight,
        toggleVisible: data.toggleVisible,
        desktopNavVisible: data.desktopNavVisible,
        status,
        overflowSample: data.sampleOverflow,
      });

      console.log(
        `[${status}] ${vp.name.padEnd(22)} (${String(vp.width).padStart(4)}×${String(vp.height).padEnd(4)}) | Win: ${data.winWidth}px, Doc: ${data.docWidth}px, Header: ${data.headerHeight}px | Toggle: ${data.toggleVisible ? 'Visible' : 'Hidden'}, DesktopNav: ${data.desktopNavVisible ? 'Visible' : 'Hidden'}`
      );

      if (data.hasHorizontalScroll) {
        console.error('   Overflowing Elements:', JSON.stringify(data.sampleOverflow, null, 2));
      }

      // If mobile, test menu interaction!
      if (vp.width < 860) {
        const menuTest = await cdp.send('Runtime.evaluate', {
          expression: `
            (function() {
              const toggle = document.getElementById('mobile-menu-toggle');
              const drawer = document.getElementById('mobile-nav');
              const backdrop = document.getElementById('mobile-nav-backdrop');

              if (!toggle || !drawer) return { success: false, reason: 'elements missing' };

              // Click to open
              toggle.click();
              const opened = toggle.getAttribute('aria-expanded') === 'true' && !drawer.hasAttribute('hidden');
              const drawerStyle = window.getComputedStyle(drawer);
              const isScrollable = drawerStyle.overflowY === 'auto';
              const isFixed = drawerStyle.position === 'fixed';

              // Click to close
              toggle.click();
              const closed = toggle.getAttribute('aria-expanded') === 'false' && drawer.hasAttribute('hidden');

              return {
                success: opened && closed && isScrollable && isFixed,
                opened,
                closed,
                isScrollable,
                isFixed
              };
            })()
          `,
          returnByValue: true,
        });

        const menuData = menuTest.result.value;
        if (!menuData.success) {
          console.error(`   Mobile menu interaction check failed at ${vp.width}x${vp.height}:`, menuData);
        } else {
          console.log(`   ✔ Mobile menu interaction: opens, closes, fixed overlay, scrollable drawer`);
        }
      }
    }
  }

  // Cleanup
  cdp.close();
  chromeProc.kill();
  server.close();

  const allPassed = results.every((r) => r.status === 'PASS');
  console.log(`\n========================================`);
  console.log(`SUMMARY: ${allPassed ? 'ALL VIEWPORT CHECKS PASSED (0 OVERFLOWS)' : 'FAILURES DETECTED'}`);
  console.log(`Total checks: ${results.length}`);
  console.log(`========================================\n`);

  process.exit(allPassed ? 0 : 1);
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
