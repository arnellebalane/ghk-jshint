import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import minimatch from 'minimatch';
import jshint from 'jshint';
import findConfig from 'find-config';


const CONFIG_FILENAME = '.jshintrc';


function precommit(config = {}) {
    let cwd = process.cwd();
    let gitroot = shell.exec('git rev-parse --show-toplevel', { silent: true })
        .output.trim();
    let excludes = config.exclude || [];
    let jsfiles = shell.exec('git diff HEAD --name-only', { silent: true })
        .output.trim().split(/\n\r?/g)
        .filter(file => /\.js$/.test(file))
        .map(file => path.join(cwd, file).replace(`${gitroot}/`, ''))
        .filter(file =>
            !excludes.filter(pattern => minimatch(file, pattern)).length);
    let jshintrc = readConfigFile();
    let failures = jsfiles.filter(file => !lint(file, jshintrc));
    if (failures.length) {
        return `${failures.length} javascript files failed the linting rules`;
    }
    return true;
}


function lint(file, options) {
    let fileContents = fs.readFileSync(file, 'utf8');
    jshint.JSHINT(fileContents.split(/\n\r?/g), options);
    if (jshint.JSHINT.errors.length) {
        console.log(`jshint: Linting ${file} failed`);
        jshint.JSHINT.errors.forEach(error => {
            let message = `"${error.reason}" at line ${error.line}`;
            message += error.character ? ` character ${error.character}` : '';
            console.log(`    ${message}`);
        });
        return false;
    }
    return true;
}


function readConfigFile() {
    let configfile = findConfig(CONFIG_FILENAME);
    if (configfile) {
        let config = fs.readFileSync(configfile);
        return JSON.parse(config);
    }
    return {};
}


exports['pre-commit'] = precommit;
