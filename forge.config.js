module.exports = {
  packagerConfig: {
    asar: true,
    executableName: 'youtube-desktop',
    icon: __dirname + '/images/YouTube'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://raw.githubusercontent.com/mikepruett3/youtube-desktop/main/images/YouTube.ico',
        setupIcon: __dirname + './images/YouTube.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        icon: './images/YouTube.png'
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: './images/YouTube.png'
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: './images/YouTube.png'
      },
    },
    {
      name: 'electron-forge-maker-appimage',
      platforms: ['linux'],
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'mikepruett3',
          name: 'youtube-desktop'
        }
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
