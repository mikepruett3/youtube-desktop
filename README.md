# YouTube Desktop

![YouTube](https://github.com/mikepruett3/youtube-desktop/blob/main/images/YouTube.png?raw=true)

YouTube Desktop is a simple Desktop application for watching YouTube, built using [ElectronJS](https://www.electronjs.org).

## Features

- Control for Hardware Acceleration

## Installation

Dowload the latest [release](https://github.com/mikepruett3/youtube-desktop/releases) for Windows, Linux and MacOS.

For Windows... a standard Exectuable is provided, as well as a NuGet package. RPM and DEB packages are availbe for Linux Distrubtions (not tested!).

## Launching

To run, just launch the executable via the Desktop Shortcut, or the Executable directly.

## Building

To build locally, clone the repository and install the dependencies.

```powershell
git clone https://github.com/mikepruett3/youtube-desktop.git
cd youtube-desktop
npm install
```

To run the application locally.

```powershell
npm run test
```

To build the application installer.

```powershell
npm run make
```

## Dependencies

- electron
- electron-forge
- electron-store
- publisher-github

## Errata

Logo borrowed from [Wikipedia](https://commons.wikimedia.org/wiki/File:YouTube_social_white_circle_(2017).svg)