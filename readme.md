ghk-jshint
===================

git hook to lint js files with **[jshint](https://www.npmjs.com/package/jshint)**
before committing them

plugin for **[ghk](https://www.npmjs.com/package/ghk)** package


#### installation

```
$ npm install --save ghk-jshint
```

#### usage

inside your project's `.ghkrc` (or the one in your root directory):

```
{
    "pre-commit": {
        "jshint": {
            "exclude": ["some/pattern/*", "another/pattern/*"]
        }
    }
}
```

#### options

- **exclude**: a list of patterns to exclude files from linting
