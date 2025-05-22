require('dotenv').config();

require('esbuild').build({
    entryPoints: ['index.tsx'],
    bundle: true,
    outfile: 'public/bundle.js',
    loader: {
        '.tsx': 'tsx',
        '.ts': 'ts'
    },
    define: {
        'process.env.NODE_ENV': '"development"',
        'process.env': '{}',
        'process.env.API_KEY': JSON.stringify(process.env.WEATHER_API_KEY),
    },
    platform: 'browser',
}).catch(() => process.exit(1));