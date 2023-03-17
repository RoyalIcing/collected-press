import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'

describe('Worker', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    worker = await unstable_dev(__dirname + '/worker.ts', {
      experimental: { disableExperimentalWarning: true },
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  // TODO: these should load from this repo, not RoyalIcing/RoyalIcing
  it('can render /', async () => {
    const resp = await worker.fetch('/')
    const text = await resp.text()
    expect(text).toContain('<!doctype html>')
    expect(text).toMatch(
      `<h1>Patrick Smith — Product Developer &amp; Design Engineer</h1>`,
    )
  })

  it('can render /2020', async () => {
    const resp = await worker.fetch('/2020')
    const text = await resp.text()
    expect(text).toMatch(`<h1>Articles</h1>`)
    expect(text).toMatch(`Vary variables not rules in CSS media queries`)
  })

  it('can render /blog', async () => {
    const resp = await worker.fetch('/blog')
    const text = await resp.text()
    expect(text).toMatch(`<h1>Articles</h1>`)
    expect(text).toMatch(`Vary variables not rules in CSS media queries`)
    expect(text).toMatch(`The Missing App Economy`)
    expect(text).toMatch(`November 24, 2020`)
  })

  it('can render /2020/vary-variables-not-rules-in-css-media-queries', async () => {
    const resp = await worker.fetch(
      '/2020/vary-variables-not-rules-in-css-media-queries',
    )
    const text = await resp.text()
    expect(text).toMatch(`Vary variables not rules in CSS media queries`)
    expect(text).toMatch(`November 24, 2020</time>`)
  })

  it('can load /__assets/tailwindcssbase/abc', async () => {
    const resp = await worker.fetch('/__assets/tailwindcssbase/abc')
    const text = await resp.text()
    expect(text).toContain(`tailwindcss.com`)
    expect(text).toContain(`MIT License`)
  })
  it('can load /assets/hoverlytics.jpg', async () => {
    const resp = await worker.fetch('/assets/hoverlytics.jpg')
    const headers = Object.fromEntries(resp.headers)
    expect(headers['content-type']).toEqual('image/jpeg')
    const bytes = await resp.arrayBuffer()
    expect(bytes.byteLength).toBeGreaterThan(1000)
  })
})

// beforeAll(() => {
//     HTMLRewriter.prototype.transform = async function(this: HTMLRewriter, response: Response) {
//         const text = await response.arrayBuffer();
//         await this.write(new Uint8Array(text));
//         await this.end();
//     }
//     globalThis.HTMLRewriter = HTMLRewriter;
// })

// test("/", async () => {
//     const res = await serveRequest("RoyalIcing", "RoyalIcing", "");
//     expect(await res.text()).toEqual("dfgdfg");
// });
