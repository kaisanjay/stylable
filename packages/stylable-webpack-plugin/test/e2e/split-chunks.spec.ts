import { expect } from 'chai';
import { join } from 'path';
import { browserFunctions, StylableProjectRunner } from 'stylable-build-test-kit';

const project = 'split-chunks';

describe(`(${project})`, () => {
    const projectRunner = StylableProjectRunner.mochaSetup(
        {
            projectDir: join(__dirname, 'projects', project),
            port: 3001,
            puppeteerOptions: {
                // headless: false,
                // devtools: true
            }
        },
        before,
        afterEach,
        after
    );

    it('renders css', async () => {
        const { page } = await projectRunner.openInBrowser();
        const styleElements = await page.evaluate(browserFunctions.getStyleElementsMetadata);

        expect(styleElements).to.eql([
            {
                depth: '1',
                id: './node_modules/lib/test.st.css'
            },
            {
                depth: '2',
                id: './node_modules/lib/index.st.css'
            },
            {
                depth: '3',
                id: './src/index.st.css'
            }
        ]);
    });

    it('css is working', async () => {
        const { page } = await projectRunner.openInBrowser();
        const backgroundColor = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).backgroundColor;
        });

        expect(backgroundColor).to.eql('rgb(255, 0, 0)');
    });
});
