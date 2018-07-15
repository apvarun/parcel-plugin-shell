# parcel-plugin-shell  [![npm version](https://badge.fury.io/js/parcel-plugin-shell.svg)](https://badge.fury.io/js/parcel-plugin-shell)

Plugin to run shell commands before/after bundling process.

---

[【What is Parcel】](https://parceljs.org/) [【What is Prettier】](https://prettier.io/)

## Installation

Parcel will automatically start using the plugin once its added to your package.json file.

To add the plugin to your existing project, run the below command.

```
npm i parcel-plugin-shell -D
```
or
```
yarn add parcel-plugin-shell -D
```

## Configuration

The plugin allows to configure the scripts that need to be executed. The supported parameters are as follows:

```js
// package.json
{
    ...
    "shell": {
        "onBuildStart": [ "echo Starting Build" ],
        "onBuildEnd": [ "node copy.js" ],
        "onBuildExit": [ "npm run serve" ],
        "dev": false,
        "safe": false,
    }
}
```

| Parameter | Description | Default value |
|:----------|:-------------|:------:|
| onBuildStart | Array of scripts to be executed before starting the bundling | [] |
| onBuildEnd | Array of scripts to be executed after bundling completes | [] |
| onBuildExit | Array of scripts to be executed once the entire build process finishes | [] |
| dev | To disable execution of scripts in development mode | false |
| safe | To switch script execution process from spawn to exec | false |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details