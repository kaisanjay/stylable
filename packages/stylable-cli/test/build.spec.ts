import { expect } from 'chai';
import * as path from 'path';
import { Stylable } from 'stylable';
import { createMemoryFileSystemWithFiles as createFS } from 'stylable-build-test-kit';
import { build } from '../src/build';

describe('build stand alone', () => {
    it('should create modules and copy source css files', () => {
        const fs = createFS({
            '/main.st.css': `
                :import{
                    -st-from: "./components/comp.st.css";
                    -st-default:Comp;
                }
                .gaga{
                    -st-extends:Comp;
                    color:blue;
                }
            `,
            '/components/comp.st.css': `
                .baga{
                    color:red;
                }
            `
        });

        const stylable = new Stylable('/', fs as any, () => ({}));

        build({
            extension: '.st.css',
            fs: fs as any,
            stylable,
            outDir: 'lib',
            srcDir: '.',
            rootDir: path.resolve('/'),
            log: () => {
                /**/
            }
        });

        [
            '/lib/main.st.css',
            '/lib/main.st.css.js',
            '/lib/components/comp.st.css',
            '/lib/components/comp.st.css.js'
        ].forEach(p => {
            expect(fs.existsSync(path.resolve(p)), p).to.equal(true);
        });
    });
});
