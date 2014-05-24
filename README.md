> Converts HTML files into JavaScript files and populates them into a variable "htmlTemplates" in the global namespace.
> Example usage of this is while using angular-router:
> ```javascript
template: htmlTemplates['/path/to/file.html']
```
> 
> This is essentially a derivative of Mark Lagendijk's gulp-ng-html2js

## Usage

First, install `gulp-jsify-html-templates` as a development dependency:

```shell
npm install --save-dev gulp-jsify-html-templates
```

Then, add it to your `gulpfile.js`:

```javascript
var jsifyTemplates = require('gulp-jsify-html-templates');

gulp.task('jsifyTemplates', function() {
  gulp.src('partials/*.html')
    .pipe(jsifyTemplates({
        prefix: '/partials/'
    }))
    .pipe(gulp.dest('dist'))
});
```

## Options

- `prefix`

	Pass a string if you wish to prepend a string to the filename in the
    htmlTemplates object.

- `stripPrefix`

    Pass a stringi fyou wish to subtract from the file path to generate the
    file url.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

