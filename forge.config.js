module.exports = {
  packagerConfig: {
    asar: true,
    ignore: [
      /^(package\.json|build|src|public|resources|node_modules(?!\/(?:bootstrap|cross-env|csv-parser|csv-writer|electron-squirrel-startup|react|react-dom|react-router|react-router-dom|react-scripts|web-vitals|xlsx)\/).*).*$/,
    ],
    icon: 'public/BNED-a60fd395',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "VCU2TA2",
        authors: "Canari",
        description: "Convert VCU XLSX to TA2 CSV",
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
