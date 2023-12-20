import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import inject from 'gulp-inject';
import imagemin from 'gulp-imagemin';
import sass from 'gulp-dart-sass';

export function startServer(done) {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });
  done();
}

export function build() {
  // Convert SCSS to CSS, add autoprefixing, minify CSS
  gulp.src('css/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('dist/css'));

  // Concatenate and uglify JS files
  gulp.src('js/*.js')
    .pipe(concat('script.js')) // Concatenate JS files
    .pipe(uglify()) // Uglify JS
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js')); // Save in dist/js directory

  // Minify images
  gulp.src('img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));

  // Inject generated files into index.html
  const sources = gulp.src(['dist/css/*.css', 'dist/js/*.js'], { read: false });
  return gulp.src('index.html')
    .pipe(inject(sources, { relative: true, ignorePath: 'dist/' })) // Inject CSS and JS files
    .pipe(gulp.dest('dist'));
}

// Watch task
export function watch() {
  gulp.watch('css/*.scss', gulp.series(build, reload));
  gulp.watch('js/*.js', gulp.series(build, reload));
  gulp.watch('index.html', gulp.series(build, reload));
}

// Serve task
export const serve = gulp.series(build, startServer, watch);

// Reload browser
function reload(done) {
  browserSync.reload();
  done();
}
