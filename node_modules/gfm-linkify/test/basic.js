describe('basic test', function () {
  it('linkifies sha1', function () {
    assert.equal(linkify('16c999e8c71134401a78d4d46435517b2271d6ac', 'mojombo/github-flavored-markdown'), '<a href="https://github.com/mojombo/github-flavored-markdown/commit/16c999e8c71134401a78d4d46435517b2271d6ac">16c999e</a>');
  });
  it('not without repo', function () {
    assert.equal(linkify('16c999e8c71134401a78d4d46435517b2271d6ac', 'mojombo'), '16c999e8c71134401a78d4d46435517b2271d6ac');
  });
  it('linkifies user@sha1', function () {
    assert.equal(linkify('carlos8f@16c999e8c71134401a78d4d46435517b2271d6ac', 'mojombo/github-flavored-markdown'), '<a href="https://github.com/carlos8f/github-flavored-markdown/commit/16c999e8c71134401a78d4d46435517b2271d6ac">carlos8f@16c999e</a>');
  });
  it('not without repo', function () {
    assert.equal(linkify('carlos8f@16c999e8c71134401a78d4d46435517b2271d6ac', 'mojombo'), 'carlos8f@16c999e8c71134401a78d4d46435517b2271d6ac');
  });
  it('linkifies user/project@sha1', function () {
    assert.equal(linkify('carlos8f/motley@32deaf23623c9090ca39aa1780f34d1506150082'), '<a href="https://github.com/carlos8f/motley/commit/32deaf23623c9090ca39aa1780f34d1506150082">carlos8f/motley@32deaf2</a>');
  });
  it('linkifies user/project@sha1 with different context', function () {
    assert.equal(linkify('carlos8f/motley@32deaf23623c9090ca39aa1780f34d1506150082', 'mojombo/github-flavored-markdown'), '<a href="https://github.com/carlos8f/motley/commit/32deaf23623c9090ca39aa1780f34d1506150082">carlos8f/motley@32deaf2</a>');
  });
  it('linkifies #issue', function () {
    assert.equal(linkify('#2', 'carlos8f/motley'), '<a href="https://github.com/carlos8f/motley/issues/2">#2</a>');
  });
  it('linkifies user#issue', function () {
    assert.equal(linkify('cpsubrian#2', 'carlos8f/motley'), '<a href="https://github.com/cpsubrian/motley/issues/2">cpsubrian#2</a>');
  });
  it('not without repo', function () {
    assert.equal(linkify('cpsubrian#2', 'carlos8f'), 'cpsubrian#2');
  });
  it('linkifies user/project#issue', function () {
    assert.equal(linkify('cpsubrian/motley#2'), '<a href="https://github.com/cpsubrian/motley/issues/2">cpsubrian/motley#2</a>');
  });
});
