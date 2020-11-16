import { Component, OnInit, AfterViewChecked  } from '@angular/core';
import { HighlightService } from '../highlight.service';
import * as vkbeautify from 'vkbeautify';

@Component({
  selector: 'app-blogpost',
  templateUrl: './blogpost.component.html',
  styleUrls: ['./blogpost.component.less']
})
export class BlogpostComponent implements OnInit, AfterViewChecked  {
  htmlContent: string = `
  <p>I implemented <a href=\"http://prismjs.com\">Prism.js</a> based code syntax highlight feature for my blog. This blog post shows how to use Prism with Angular.</p>\n<blockquote>\n<p>Prism is a lightweight, extensible syntax highlighter, built with modern web standards in mind.</p>\n</blockquote>\n<p><strong>There are few existing Angular solutions for Prism:</strong></p>\n<ul>\n<li><a href=\"https://github.com/ngx-prism/core\">https://github.com/ngx-prism/core</a></li>\n<li><a href=\"https://github.com/vaibhav93/angular-prism\">https://github.com/vaibhav93/angular-prism</a></li>\n<li><a href=\"https://github.com/tpadjen/ng2-prism\">https://github.com/tpadjen/ng2-prism</a></li>\n</ul>\n<p>But I decided not to use the existing ones because all the solutions use a component which requires code blocks as a content or as a parameter. Content of my blog is fetched from REST API as HTML so I can't (easily) separate code blocks from other content. That's why I decided to see how to implement support for the Prism without existing components. I use Prism's <a href=\"https://github.com/PrismJS/prism/blob/71595beca7ab3c9f3d9ba633898d14e4671691f5/prism.js#L162\">highlightAll</a> method to process all of the pre and code tags once.</p>\n<p>Implementing following steps needs a basic knowledge about Angular development.</p>\n<h2>1. Install Prism from npm</h2>\n<pre><code>$ npm install prismjs --save\n</code></pre>\n<h2>2. Create highlight service</h2>\n<p>Prism.js dependencies are imported in this service. Here you can add supported languages and additional Prism plugins you might want to use.</p>\n<pre><code class=\"language-typescript\">import { Injectable, Inject } from '@angular/core';\n\nimport { PLATFORM_ID } from '@angular/core';\nimport { isPlatformBrowser } from '@angular/common';\n\nimport 'clipboard';\n\nimport 'prismjs';\nimport 'prismjs/plugins/toolbar/prism-toolbar';\nimport 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';\nimport 'prismjs/components/prism-css';\nimport 'prismjs/components/prism-javascript';\nimport 'prismjs/components/prism-java';\nimport 'prismjs/components/prism-markup';\nimport 'prismjs/components/prism-typescript';\nimport 'prismjs/components/prism-sass';\nimport 'prismjs/components/prism-scss';\n\ndeclare var Prism: any;\n\n@Injectable()\nexport class HighlightService {\n\n  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }\n\n  highlightAll() {\n    if (isPlatformBrowser(this.platformId)) {\n      Prism.highlightAll();\n    }\n  }\n}\n</code></pre>\n<p>Add service into <code>app.module.ts</code></p>\n<pre><code class=\"language-typescript\">  providers: [\n    ...\n    HighlightService,\n  ],\n</code></pre>\n<p>My implementation doesn't support server side rendering at the moment. Code syntax highlighting is enabled only for a browser because <code>Prism.highlightAll</code> uses <code>document</code> which is not available in Node.js. There probably are workarounds for this but I don't see code highlighting that important for server side rendering.</p>\n<p>Prism supports <a href=\"http://prismjs.com/#languages-list\">130 languages</a> so I only import the ones I really need.</p>\n<h2>3. Use highlight service in your component</h2>\n<p>Then let's add the service into a component which handles data we want to highlight.</p>\n<p>Lifecycle hook <a href=\"https://angular.io/guide/lifecycle-hooks#afterview\">AfterViewChecked</a> is used here to call the highlight service when view is ready. Method <code>ngAfterViewChecked</code> might be called multiple times. I use <code>highlighted</code> boolean to check if highlighting is already done to prevent multiple <code>highlightAll</code> method calls.</p>\n<pre><code class=\"language-typescript\">import { Component, OnInit, AfterViewChecked } from '@angular/core';\n\nimport { HighlightService } from '../shared/utils/highlight.service';\n\n@Component({\n  selector: 'app-blog-post',\n  templateUrl: './blog-post.component.html',\n  styleUrls: ['./blog-post.component.scss']\n})\nexport class BlogPostComponent implements OnInit, AfterViewChecked {\n  \n  blogPost: BlogPostInterface;\n  highlighted: boolean = false;\n  \n  constructor(\n    ...\n    private highlightService: HighlightService) {\n  }\n\n  /**\n   * Highlight blog post when it's ready\n   */\n  ngAfterViewChecked() {\n    if (this.blogPost &amp;&amp; !this.highlighted) {\n      this.highlightService.highlightAll();\n      this.highlighted = true;\n    }\n  }\n\n  /**\n   * Fetch blog post from API\n   */\n  ngOnInit() {\n    ...\n  }\n}\n</code></pre>\n<p>This code is just a partial example how to use recently created service in your own component. You need to adapt usage for your custom component.</p>\n<h2>4. Add Prism styles</h2>\n<p>Next add Prism styles into your <code>styles.scss</code>. Theme CSS is needed at least. Check my <a href=\"https://auralinna.blog/post/2017/how-to-customize-bootstrap-styles-and-variables-when-using-ng-bootstrap\">earlier blog post</a> how to change Angular to use SCSS instead of CSS if you don't use SCSS already. Alternatively you can add CSS files directly into your HTML.</p>\n<pre><code class=\"language-scss\">@import &quot;~prismjs/plugins/toolbar/prism-toolbar.css&quot;;\n@import &quot;~prismjs/themes/prism-okaidia&quot;;\n</code></pre>\n<hr />\n<p>It should be working now. Please feel free to comment this post if you have questions or suggestions how to improve code base.</p>
  `
  xmlData = `<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>`;
  xmlContent = `<pre><code class="language-xml"></code></pre>`;
  highlighted: boolean = false;
  constructor(private highlightService: HighlightService) {
    let xmlPretty = vkbeautify.xml(this.xmlData);
    let replacedXml = xmlPretty.replace(/\</g,"&lt;");
    replacedXml = replacedXml.replace(/\>/g,"&gt;");
    this.xmlContent = `<pre><code class="language-xml">${replacedXml}</code></pre>`;
   }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    if (!this.highlighted) {
      this.highlightService.highlightAll();
      this.highlighted = true;
    }
  }
}
