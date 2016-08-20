const feed = require('../feed');
const expect = require('chai').expect;

describe('Feed', () => {
  it('should fetch posts from xml', (done) => {
    const BLOG_URL = 'https://nodejs.github.io/nodejs-ko/atom.xml';
    feed.fetch(BLOG_URL, (err, data) => {
      if (err) { done(err); }

      expect(data.length).to.equal(20);
      done();
    });
  });

  it.only('should normalize posts', () => {
    let posts = [
      { title: 'Node v4.5.0(LTS)',
        description: '',
        summary: '<!--\n### Notable Changes\n\nSemver Minor:\n\n* **buffer**:\n * backport new buffer constructor APIs to v4.x (Сковорода Никита Андреевич) [#7562](',
        date: '2016-08-19T05:12:42.000Z',
        pubdate: '2016-08-15T15:00:00.000Z',
        pubDate: '2016-08-15T15:00:00.000Z',
        link: 'https://nodejs.github.io/nodejs-ko/articles/2016/08/16/release-v4.5.0/',
        guid: 'https://nodejs.github.io/nodejs-ko/articles/2016/08/16/release-v4.5.0/',
        author: 'Node.js 한국어 번역팀'
      },
      { title: 'Node v6.4.0(최신 버전)',
        description: '',
        summary: '<h3 id="주요-변경-사항"><a href="#주요-변경-사항" class="headerlink" title="주요 변경 사항"></a>주요 변경 사항</h3><!--\n* **build**: zlib symbols and additional Ope',
        date: '2016-08-17T19:50:16.000Z',
        pubdate: '2016-08-15T15:00:00.000Z',
        pubDate: '2016-08-15T15:00:00.000Z',
        link: 'https://nodejs.github.io/nodejs-ko/articles/2016/08/16/release-v6.4.0/',
        guid: 'https://nodejs.github.io/nodejs-ko/articles/2016/08/16/release-v6.4.0/',
        author: 'Node.js 한국어 번역팀'
      }
    ];

    let normalizedFeed = feed.normalize(posts);
    expect(normalizedFeed[0]).to.have.property('title');
    expect(normalizedFeed[0]).to.have.property('link');
    expect(normalizedFeed[1]).to.have.property('title');
    expect(normalizedFeed[1]).to.have.property('link');
  });
});
