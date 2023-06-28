import { src, dest, watch, series } from "gulp";
import sass from "gulp-sass";
import prefix from "gulp-autoprefixer";
import minify from "gulp-clean-css";
import terser from "gulp-terser";
import imagemin from "gulp-imagemin";
import imagewebp from "gulp-webp";

// Rest of the code remains the same...


function minjs() {
  return src("public/js/*.js").pipe(terser()).pipe(dest("dist/js"));
}

function optimizeimg() {
  return src("public/images/*")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 2 }),
      ])
    )
    .pipe(dest("dist/images"));
}

function webpimg() {
  return src("public/images/*")
  .pipe(imagewebp())
  .pipe(dest("dist/images"));
}

function mincss() {
  return src("public/css/*.css")
    .pipe(prefix())
    .pipe(minify())
    .pipe(dest("dist/css"));
}

function watchTask() {
  watch('public/css/*.css', mincss);
    watch('public/js/*.js', minjs);
    watch('public/images/*', optimizeimg);
    watch('dist/images/*', webpimg);
}

exports.default = series(mincss, minjs, optimizeimg, webpimg, watchTask);