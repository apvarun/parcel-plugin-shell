const spawn = require("child_process").spawn;
const exec = require("child_process").exec;
const os = require("os");
const path = require("path");
const fs = require("fs");

const defaultOptions = {
    onBuildStart: [],
    onBuildEnd: [],
    onBuildExit: [],
    dev: false,
    safe: false
};

function spreadStdoutAndStdErr(proc) {
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stdout);
}

function errCallback(error, stdout, stderr) {
    if (error) {
        throw error;
    }
}

function serializeScript(script) {
    if (typeof script === "string") {
        const [command, ...args] = script.split(" ");
        return { command, args };
    }
    const { command, args } = script;
    return { command, args };
}

function executeScript(script) {
    if (os.platform() === "win32" || defaultOptions.safe) {
        spreadStdoutAndStdErr(exec(script, errCallback));
    } else {
        const { command, args } = serializeScript(script);
        const proc = spawn(command, args, { stdio: "inherit" });
        proc.on("close", errCallback);
    }
}

module.exports = function(bundler) {
    // Get package.json file
    const filePath = path.join(process.cwd(), "package.json");

    let pkgFile;
    if (fs.existsSync(filePath)) {
        pkgFile = JSON.parse(fs.readFileSync(filePath, "utf8") || {});
    } else {
        console.log("Package.json file does not exist.");
        return;
    }

    // Get 'staticPath' from package.json file
    let shellInput = Object.assign(defaultOptions, pkgFile.shell);

    // bundle Start
    // Emitted only in parcel v1.9.0 and above
    bundler.on("buildStart", () => {
        if (shellInput && shellInput.onBuildStart && !shellInput.dev) {
            for (let i = 0; i < shellInput.onBuildStart.length; i++) {
                executeScript(shellInput.onBuildStart[i]);
            }
        }
    });

    // bundle End
    bundler.on("bundled", () => {
        if (shellInput && shellInput.onBuildEnd && !shellInput.dev) {
            for (let i = 0; i < shellInput.onBuildEnd.length; i++) {
                executeScript(shellInput.onBuildEnd[i]);
            }
        }
    });

    // bundle Exit
    bundler.on("buildEnd", () => {
        if (shellInput && shellInput.onBuildExit && !shellInput.dev) {
            for (let i = 0; i < shellInput.onBuildExit.length; i++) {
                executeScript(shellInput.onBuildExit[i]);
            }
        }
    });
};
