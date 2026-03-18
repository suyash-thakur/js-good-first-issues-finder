gfm-linkify
===========

linkify repository references in
[github-flavored markdown](https://help.github.com/articles/github-flavored-markdown)
text, such as `sha1`, `user/repo@sha1`, `#issue`, etc

[![build status](https://secure.travis-ci.org/carlos8f/gfm-linkify.png)](http://travis-ci.org/carlos8f/gfm-linkify)

[![NPM](https://nodei.co/npm/gfm-linkify.png?downloads=true)](https://nodei.co/npm/gfm-linkify/)

## Here's the deal

This module performs repository-relative linkification which is a key part of
"Github-flavoredness" that [marked left out](https://github.com/chjj/marked/issues/44).
Best used in conjunction with [marked](https://npmjs.org/package/marked) (or
[ultramarked](https://npmjs.org/package/ultramarked)) to achieve full GFM emulation!

## Usage

```js
var linkify = require('gfm-linkify');

linkify('fixed in #14', 'carlos8f/haredis');
// 'fixed in <a href="https://github.com/carlos8f/haredis/issues/14">#14</a>'

linkify('see carlos8f/motley@1a13633481e243ccc52745b5e0213066dfce0ce1');
// 'see <a href="https://github.com/carlos8f/motley/commit/1a13633481e243ccc52745b5e0213066dfce0ce1">carlos8f/motley@1a13633</a>'

linkify('merged carlos8f@a2da6b1e65a60febedde05b601349b8947e8c270', 'jeffbski/redis-wstream');
// 'merged <a href="https://github.com/carlos8f/redis-wstream/commit/a2da6b1e65a60febedde05b601349b8947e8c270">carlos8f@a2da6b1</a>'
```

etc.

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT

- Copyright (C) 2013 Carlos Rodriguez (http://s8f.org/)
- Copyright (C) 2013 Terra Eclipse, Inc. (http://www.terraeclipse.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

