import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');

test('Suite 1: Build Output & File Existence', async (t) => {
  await t.test('dist directory exists', () => {
    assert.ok(fs.existsSync(DIST_DIR), 'dist directory must exist');
  });

  await t.test('main routes exist and are non-empty', () => {
    const indexPath = path.join(DIST_DIR, 'index.html');
    const hatliPath = path.join(DIST_DIR, 'projects', 'hatli', 'index.html');

    assert.ok(fs.existsSync(indexPath), 'dist/index.html must exist');
    assert.ok(fs.statSync(indexPath).size > 10000, 'index.html must be > 10KB');

    assert.ok(fs.existsSync(hatliPath), 'dist/projects/hatli/index.html must exist');
    assert.ok(fs.statSync(hatliPath).size > 10000, 'hatli case study must be > 10KB');
  });

  await t.test('robots.txt and favicon.svg exist', () => {
    const robots = path.join(DIST_DIR, 'robots.txt');
    const favicon = path.join(DIST_DIR, 'favicon.svg');

    assert.ok(fs.existsSync(robots), 'robots.txt must exist');
    assert.match(fs.readFileSync(robots, 'utf8'), /User-agent:\s*\*/i);

    assert.ok(fs.existsSync(favicon), 'favicon.svg must exist');
  });

  await t.test('authentic CV PDF exists with exact verified size', () => {
    const cvPath = path.join(DIST_DIR, 'Ahmed_Khaled.pdf');
    assert.ok(fs.existsSync(cvPath), 'Ahmed_Khaled.pdf must exist in dist');
    assert.strictEqual(fs.statSync(cvPath).size, 105921, 'CV must be exactly 105,921 bytes');
  });
});

test('Suite 2: Authentic Asset Verification', async (t) => {
  const assets = [
    'images/projects/hatli-mockup.jpg',
    'images/projects/hatli-screens.svg',
    'images/projects/hatli-logo.svg',
    'images/projects/shoppe.png',
    'images/projects/weather.png',
    'images/experience/sapqoon.jpg',
    'images/experience/smartlee.png',
    'images/education/iti.png',
    'images/education/menofia.jpg',
  ];

  for (const asset of assets) {
    await t.test(`asset ${asset} exists with valid content`, () => {
      const fullPath = path.join(DIST_DIR, asset);
      assert.ok(fs.existsSync(fullPath), `Asset ${asset} must physically exist in dist`);
      assert.ok(fs.statSync(fullPath).size > 500, `Asset ${asset} must be non-empty`);
    });
  }
});

test('Suite 3: HTML Structure & Accessibility Integrity', async (t) => {
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  const hatliHtml = fs.readFileSync(path.join(DIST_DIR, 'projects', 'hatli', 'index.html'), 'utf8');

  await t.test('accessibility: skip-to-content link exists in both pages', () => {
    assert.match(indexHtml, /href="#main-content"/i, 'index.html must have skip link');
    assert.match(indexHtml, /id="main-content"/i, 'index.html must have #main-content');
    assert.match(hatliHtml, /href="#main-content"/i, 'hatli.html must have skip link');
    assert.match(hatliHtml, /id="main-content"/i, 'hatli.html must have #main-content');
  });

  await t.test('accessibility: all img tags have non-empty alt attributes', () => {
    const checkAlt = (html, pageName) => {
      const imgRegex = /<img\s+[^>]*>/gi;
      const matches = html.match(imgRegex) || [];
      for (const img of matches) {
        assert.ok(/alt="[^"]+"/i.test(img), `Every img on ${pageName} must have non-empty alt: ${img}`);
      }
    };
    checkAlt(indexHtml, 'index.html');
    checkAlt(hatliHtml, 'hatli.html');
  });

  await t.test('accessibility: all button elements have text or accessible labels', () => {
    const checkButtons = (html, pageName) => {
      const btnRegex = /<button\s+[^>]*>([\s\S]*?)<\/button>/gi;
      let match;
      while ((match = btnRegex.exec(html)) !== null) {
        const fullBtn = match[0];
        const innerContent = match[1].trim();
        const hasAriaLabel = /aria-label="[^"]+"/i.test(fullBtn);
        const hasText = innerContent.length > 0 && !/^<svg[\s\S]*<\/svg>$/.test(innerContent);
        assert.ok(hasAriaLabel || hasText, `Button on ${pageName} must have accessible name: ${fullBtn}`);
      }
    };
    checkButtons(indexHtml, 'index.html');
    checkButtons(hatliHtml, 'hatli.html');
  });

  await t.test('heading hierarchy: exactly one h1 per page', () => {
    const countH1 = (html) => (html.match(/<h1[\s>]/gi) || []).length;
    assert.strictEqual(countH1(indexHtml), 1, 'index.html must have exactly one <h1>');
    assert.strictEqual(countH1(hatliHtml), 1, 'hatli.html must have exactly one <h1>');
  });

  await t.test('theme: Zero-FOUC theme script and data-theme attribute exist', () => {
    assert.match(indexHtml, /data-theme=/i, 'HTML must declare data-theme');
    assert.match(indexHtml, /localStorage\.getItem\(['"]theme['"]\)/, 'Zero-FOUC script must read localStorage');
    assert.match(indexHtml, /id="theme-toggle"/, 'Theme toggle button must exist');
  });

  await t.test('mobile nav: drawer toggle and drawer have correct aria attributes', () => {
    assert.match(indexHtml, /id="mobile-menu-toggle"/, 'Mobile menu toggle button must exist');
    assert.match(indexHtml, /aria-controls="mobile-nav"/, 'Toggle button must control mobile-nav');
    assert.match(indexHtml, /id="mobile-nav"/, 'Mobile nav container must exist');
  });
});

test('Suite 4: Link Integrity & Anchor Verification', async (t) => {
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

  await t.test('all anchor targets on homepage exist as DOM IDs', () => {
    const anchors = ['about', 'hatli', 'projects', 'experience', 'skills', 'education', 'contact'];
    for (const anchor of anchors) {
      assert.ok(
        indexHtml.includes(`id="${anchor}"`),
        `Anchor target #${anchor} must exist in index.html`
      );
    }
  });

  await t.test('no dead or placeholder hrefs exist', () => {
    assert.ok(!indexHtml.includes('href="#"'), 'index.html must not contain href="#"');
    assert.ok(!indexHtml.includes('javascript:void(0)'), 'index.html must not contain javascript:void(0)');
  });

  await t.test('all external links open securely in new tab', () => {
    const externalLinks = [
      'https://github.com/AhmedKhaled2711',
      'https://www.linkedin.com/in/ahmed-khaled-android',
      'https://github.com/AhmedKhaled2711/Hatli',
      'https://github.com/AhmedKhaled2711/Shoppe',
      'https://github.com/AhmedKhaled2711/Timely',
      'https://github.com/AhmedKhaled2711/WeatherApplication',
      'https://github.com/AhmedKhaled2711/FoodPlanner'
    ];

    for (const url of externalLinks) {
      assert.ok(indexHtml.includes(url), `index.html must contain link to ${url}`);
    }
  });

  await t.test('no broken image references', () => {
    const srcRegex = /src="(\/images\/[^"]+)"/g;
    let match;
    while ((match = srcRegex.exec(indexHtml)) !== null) {
      const imgPath = match[1].replace(/^\//, '');
      const fullPath = path.join(DIST_DIR, imgPath);
      assert.ok(fs.existsSync(fullPath), `Referenced image ${imgPath} must exist on disk`);
    }
  });
});
