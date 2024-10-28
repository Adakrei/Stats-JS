import { RollupOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import nodeResolve from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import { createRequire } from 'module';

const pkg = createRequire(import.meta.url)('./package.json');
const isProduction = process.env.BUILD === 'production';
const globalName = 'statsjs';
const sourceFile = 'src/index.ts';

// JS config
const jsConfig: RollupOptions = {
    input: sourceFile,
    output: [
        {
            file: pkg.exports['.']['umd'],
            format: 'umd',
            name: globalName,
            plugins: isProduction ? [terser()] : []
        }
    ],
    plugins: [
        typescript(),
        tsConfigPaths(),
        nodeResolve(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

// ES Module config
const esConfig: RollupOptions = {
    input: sourceFile,
    output: [
        {
            file: pkg.exports['.']['import'],
            format: 'es'
        }
    ],
    plugins: [
        typescript(),
        tsConfigPaths(),
        nodeResolve(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

// DTS config
const dtsConfig: RollupOptions = {
    input: sourceFile,
    output: {
        file: pkg.exports['.']['types'],
        format: 'es'
    },
    plugins: [
        tsConfigPaths(),
        dts()
    ]
};

export default [jsConfig, esConfig, dtsConfig];